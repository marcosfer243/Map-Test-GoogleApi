import React from 'react';

//Chackra Ui
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  SkeletonText
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa';

//Google maps Api
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

const center = {
  lat:-31.4167,
  lng:-64.1833
}

/**
 * 
 *  options ={{
 * zoomControl:false,
 * streetViewControl:fasle,
 * mapTypeControl:false,
 * fullScreenControl:false
 * }}
 */

const places = 'places'

function App() {

  const [map, setMap] = React.useState(/**  @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = React.useState(null);
  const [distance, setDistance] = React.useState("")
  const [duration, setDuration] = React.useState("")

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = React.useRef();

  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinacionRef= React.useRef();

  const {isLoaded}= useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries:[places]
  });

  if(!isLoaded){
    return <SkeletonText/>
  }

  async function calculateRoute() {
    if(originRef.current.value ===''|| destinacionRef.current.value === ''){
      return
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin:originRef.current.value,
      destination:destinacionRef.current.value,
    // eslint-disable-next-line no-undef
      travelMode:google.maps.TravelMode.DRIVING,
    })

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoutes() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinacionRef.current.value = '';
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgColor='blue.200'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='50%'>
        {/**Google Map Box */}
      <GoogleMap center={center} zoom={7} mapContainerStyle={{width:"100%", height:"100%"}}
      options={{
        mapTypeControl:false
      }}
      onLoad={map=>setMap(map)}
      >
        {/**Displaying directions */}
        {directionsResponse && <DirectionsRenderer 
        directions={directionsResponse}
        />}
      </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='2'
      >
        <HStack spacing={4}>
        <Autocomplete >
          <Input type='text' placeholder='Origin' ref={originRef} />
        </Autocomplete>
        <Autocomplete>
          <Input type='text' placeholder='Destination' ref={destinacionRef} />
        </Autocomplete>
          <ButtonGroup>
            <Button onClick={calculateRoute} colorScheme='pink' type='submit'>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={() => clearRoutes()}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance:{distance} </Text>
          <Text>Duration:{duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App

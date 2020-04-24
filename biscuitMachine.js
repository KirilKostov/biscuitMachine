const SWITCH_VALUES = ['off', 'pause', 'on']
const MIN_BAKING_TEMPERATURE = 220
const MAX_BAKING_TEMPERATURE = 240

let conveyorIsOn = false
let ovenIsOn = false
let currentOvenTemperature = 0
let biscuitsCount = 0

const setBiscuitMachineState = machineSwitch => {
  if (validateSwitchValue(machineSwitch)){
    machineMotor(machineSwitch)
  } else {
    console.log('Please provide a valid switch value such as "off", "pause" or "on".')
    return false
  }
}

const validateSwitchValue = inputValue => {
  let isSwitchValueValid = false

  SWITCH_VALUES.forEach(value => {
    if (value === inputValue) {
      isSwitchValueValid = true
    }
  })
  return isSwitchValueValid
}

const machineMotor = machineSwitch => {
  switch (machineSwitch) {
    case 'on':
      startOven()
      break
    case 'pause':
      conveyorIsOn = false
      break
    default:
      stopOven()
  }
}

const bake = () => {
  return new Promise(resolve => setTimeout(resolve, 350))
}

const temperatureRampTime = () => {
  return new Promise(resolve => setTimeout(resolve, 150))
}

const startOven = async () => {
  if (ovenIsOn) {
    console.log('Oven is already on')
    return false
  }
  ovenIsOn = true
  conveyorIsOn = true

  while (ovenIsOn) {
    await temperatureRampTime()
    currentOvenTemperature ++
    console.log('Oven heating. Current temperature: ' + currentOvenTemperature)
    if (currentOvenTemperature >= MIN_BAKING_TEMPERATURE && currentOvenTemperature <= MAX_BAKING_TEMPERATURE && conveyorIsOn) {
      await bake(500)
      biscuitsCount ++
      console.log('Current biscuitsCount: ' + biscuitsCount)
    }

    if (currentOvenTemperature === MAX_BAKING_TEMPERATURE) {
      console.log('Oven reached maximum temperature. Shutting down due to danger of overheating.')
      stopOven()
    }
  }
}

const stopOven = async () => {
  if (!ovenIsOn) {
    console.log('Oven is already off')
    return false
  }

  ovenIsOn = false
  conveyorIsOn = false
  while(!ovenIsOn && currentOvenTemperature > 0) {
    await temperatureRampTime()
    currentOvenTemperature --
    console.log('Oven cooling. Current temperature: ' + currentOvenTemperature)
  }
  return false
}

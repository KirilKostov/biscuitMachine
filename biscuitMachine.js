const SWITCH_VALUES = ['off', 'pause', 'on']
const MIN_BAKING_TEMPERATURE = 220
const MAX_BAKING_TEMPERATURE = 240

let machineIsPaused = false
let conveyorIsOn = false
let ovenIsOn = false
let heaterIsOn = false
let currentOvenTemperature = 0
let biscuitsCount = 0
let extruderPulseCount = 0
let stamperPulseCount = 0

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
      pauseMachine()
      break
    default:
      stopOven()
  }
}

const timeOut = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const startOven = async () => {
  if (machineIsPaused) {
    machineIsPaused = false
  }

  if (ovenIsOn) {
    console.log('Oven is already on')
    return false
  }

  ovenIsOn = true
  heaterIsOn = true

  while (ovenIsOn) {
    if (heaterIsOn) {
      await timeOut(50)
      currentOvenTemperature ++
      console.log('Heater is ON, current oven temperature is: ' + currentOvenTemperature)
    } else {
      await timeOut(100)
      currentOvenTemperature --
      console.log('Heater is OFF, current oven temperature is: ' + currentOvenTemperature)
    }
    if (currentOvenTemperature >= MAX_BAKING_TEMPERATURE) {
      heaterIsOn = false
      console.log('Maximum baking temperature reached, turning heater off')
    }
    if (currentOvenTemperature <= MIN_BAKING_TEMPERATURE && !heaterIsOn) {
      heaterIsOn = true
      console.log('Turning heater on')
    }

    conveyorIsOn = currentOvenTemperature >= MIN_BAKING_TEMPERATURE && !machineIsPaused
    if (conveyorIsOn) {
      extruderPulseCount ++
      stamperPulseCount ++
      await timeOut(200)
      biscuitsCount ++
      console.group('Baking :)')
        console.log('Biscuits baked: ' + biscuitsCount)
      console.groupEnd()
    }
  }
}

const stopOven = async () => {
  if (!ovenIsOn) {
    console.log('Oven is already off')
    return false
  }

  ovenIsOn = false
  heaterIsOn = false
  conveyorIsOn = false

  while (!ovenIsOn && currentOvenTemperature > 0) {
    await timeOut(100)
    currentOvenTemperature --
    console.log('Oven cooling. Current temperature: ' + currentOvenTemperature)
  }
  return false
}

const pauseMachine = () => {
  if (machineIsPaused) {
    console.log('Machine is already paused')
    return false
  }
  machineIsPaused = true
}

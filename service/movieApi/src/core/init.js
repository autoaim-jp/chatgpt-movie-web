export const mod = {}
export const store = {}

export default {}

export const init = async ({ setting, output, input, lib, amqpConnection }) => {
  const amqpChannel = await amqpConnection.createChannel()
  mod.amqpChannel = amqpChannel

  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}


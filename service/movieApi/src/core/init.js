export const mod = {}
export const store = {}

export default {}

export const init = async ({ setting, output, input, lib, amqpConnection, path }) => {
  const amqpChannel = await amqpConnection.createChannel()
  mod.amqpChannel = amqpChannel
  mod.path = path

  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}


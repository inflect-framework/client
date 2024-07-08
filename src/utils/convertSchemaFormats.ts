import avro from 'avro-js';
import protobuf from 'protobufjs';

export const convertSchemaFormats = async (
  data: any,
  format: 'json' | 'avro' | 'protobuf'
) => {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'avro':
      const avroSchema = JSON.parse(data.schema);
      const avroType = avro.parse(avroSchema);
      const avroBuffer = Buffer.from(data, 'base64');
      const avroData = avroType.fromBuffer(avroBuffer);
      return JSON.stringify(avroData, null, 2);
    case 'protobuf':
      const protoRoot = await protobuf.load(data.schema);
      const protoType = protoRoot.lookupType('YourMessageType');
      const protoMessage = protoType.decode(Buffer.from(data, 'base64'));
      const protoObject = protoType.toObject(protoMessage, {
        enums: String,
        longs: String,
        defaults: true,
        arrays: true,
        objects: true,
      });
      return JSON.stringify(protoObject, null, 2); // Or a custom Protobuf-specific text format
    default:
      throw new Error('Unsupported format');
  }
};

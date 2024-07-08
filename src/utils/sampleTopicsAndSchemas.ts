const topics = ['target_topic', 'producer', 'source_topic'];
const subjects = [
  'testAvro',
  'sourceTopicSchema',
  'testProtobuf',
  'inflect.streamprocessor.Message',
  'confluentSampleAvro',
  'confluentSampleJSON',
  'confluentSampleProtobuf',
  'testJSON',
];
const schemas = [
  {
    subject: 'testAvro',
    schema:
      '{"type":"record","name":"User","namespace":"com.example","fields":[{"name":"id","type":"int"},{"name":"name","type":"string"},{"name":"email","type":"string"},{"name":"address","type":{"type":"record","name":"Address","fields":[{"name":"street","type":"string"},{"name":"city","type":"string"},{"name":"state","type":"string"},{"name":"zip","type":"string"}]}},{"name":"phone_numbers","type":{"type":"array","items":{"type":"record","name":"PhoneNumber","fields":[{"name":"type","type":"string"},{"name":"number","type":"string"}]}}},{"name":"birthdate","type":"string"},{"name":"is_active","type":"boolean"}]}',
  },
  {
    subject: 'sourceTopicSchema',
    schema:
      '{"type":"record","name":"Message","namespace":"inflect.streamprocessor","fields":[{"name":"key","type":"string"},{"name":"value","type":"string"}]}',
  },
  {
    subject: 'testProtobuf',
    schema:
      'syntax = "proto3";' +
      'package com.example;' +
      '' +
      'message User {' +
      '  int32 id = 1;' +
      '  string name = 2;' +
      '  string email = 3;' +
      '  Address address = 4;' +
      '  repeated PhoneNumber phone_numbers = 5;' +
      '  string birthdate = 6;' +
      '  bool is_active = 7;' +
      '}' +
      'message Address {' +
      '  string street = 1;' +
      '  string city = 2;' +
      '  string state = 3;' +
      '  string zip = 4;' +
      '}' +
      'message PhoneNumber {' +
      '  string type = 1;' +
      '  string number = 2;' +
      '}',
  },
  {
    subject: 'inflect.streamprocessor.Message',
    schema:
      '{"type":"record","name":"Message","namespace":"inflect.streamprocessor","fields":[{"name":"key","type":"string"},{"name":"value","type":"string"}]}',
  },
  {
    subject: 'confluentSampleAvro',
    schema:
      '{"type":"record","name":"sampleRecord","namespace":"com.mycorp.mynamespace","doc":"Sample schema to help you get started.","fields":[{"name":"my_field1","type":"int","doc":"The int type is a 32-bit signed integer."},{"name":"my_field2","type":"double","doc":"The double type is a double precision (64-bit) IEEE 754 floating-point number."},{"name":"my_field3","type":"string","doc":"The string is a unicode character sequence."}]}',
  },
  {
    subject: 'confluentSampleJSON',
    schema:
      '{"$schema":"http://json-schema.org/draft-07/schema#","$id":"http://example.com/myURI.schema.json","title":"SampleRecord","description":"Sample schema to help you get started.","type":"object","additionalProperties":false,"properties":{"myField1":{"type":"integer","description":"The integer type is used for integral numbers."},"myField2":{"type":"number","description":"The number type is used for any numeric type, either integers or floating point numbers."},"myField3":{"type":"string","description":"The string type is used for strings of text."}}}',
  },
  {
    subject: 'confluentSampleProtobuf',
    schema:
      'syntax = "proto3";' +
      'package com.mycorp.mynamespace;' +
      '' +
      'message SampleRecord {' +
      '  int32 my_field1 = 1;' +
      '  double my_field2 = 2;' +
      '  string my_field3 = 3;' +
      '}',
  },
  {
    subject: 'testJSON',
    schema:
      '{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"},"email":{"type":"string"},"address":{"type":"object","properties":{"street":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"zip":{"type":"string"}},"required":["street","city","state","zip"]},"phone_numbers":{"type":"array","items":{"type":"object","properties":{"type":{"type":"string"},"number":{"type":"string"}},"required":["type","number"]}},"birthdate":{"type":"string","format":"date"},"is_active":{"type":"boolean"}},"required":["id","name","email","address","phone_numbers","birthdate","is_active"],"examples":[{"id":1,"name":"John Doe","email":"john.doe@example.com","address":{"street":"123 Main St","city":"Anytown","state":"CA","zip":"12345"},"phone_numbers":[{"type":"home","number":"555-555-5555"},{"type":"work","number":"555-555-5556"}],"birthdate":"1990-01-01","is_active":true}]}',
  },
];

const processes = [
  { id: 1, name: 'capitalize', is_filter: false },
  { id: 2, name: 'isString', is_filter: true },
  { id: 3, name: 'isNumber', is_filter: true },
  { id: 4, name: 'isBoolean', is_filter: true },
  { id: 5, name: 'appendSuffix', is_filter: false },
  { id: 6, name: 'appendPrefix', is_filter: false },
];

export { topics, subjects, schemas, processes };

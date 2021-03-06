# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: lrcp/grpc_data/server.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from lrcp.grpc_data import base_pb2 as lrcp_dot_grpc__data_dot_base__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x1blrcp/grpc_data/server.proto\x1a\x19lrcp/grpc_data/base.proto\"S\n\x13\x43reateServerRequest\x12\x14\n\x0c\x61\x63\x63\x65ss_token\x18\x01 \x01(\t\x12\n\n\x02ip\x18\x02 \x01(\t\x12\x0c\n\x04port\x18\x03 \x01(\r\x12\x0c\n\x04name\x18\x04 \x01(\t\"\'\n\x14\x43reateServerResponse\x12\x0f\n\x07\x61pi_key\x18\x01 \x01(\t\"T\n\x1b\x43ollectCollectMemoryRequest\x12\x0f\n\x07\x61pi_key\x18\x01 \x01(\t\x12$\n\x04info\x18\x02 \x01(\x0b\x32\x16.GetMemoryInfoResponse\"K\n\x15\x43ollectCPUInfoRequest\x12\x0f\n\x07\x61pi_key\x18\x01 \x01(\t\x12!\n\x04info\x18\x02 \x01(\x0b\x32\x13.GetCPUInfoResponse\"K\n\x15\x43ollectNetInfoRequest\x12\x0f\n\x07\x61pi_key\x18\x01 \x01(\t\x12!\n\x04info\x18\x02 \x01(\x0b\x32\x13.GetNetInfoResponse2\xb0\x02\n\x0eServerServicer\x12%\n\x04Ping\x12\x0c.BaseRequest\x1a\r.BaseResponse\"\x00\x12=\n\x0c\x43reateServer\x12\x14.CreateServerRequest\x1a\x15.CreateServerResponse\"\x00\x12\x42\n\x11\x43ollectMemoryInfo\x12\x1c.CollectCollectMemoryRequest\x1a\r.BaseResponse\"\x00\x12\x39\n\x0e\x43ollectCPUInfo\x12\x16.CollectCPUInfoRequest\x1a\r.BaseResponse\"\x00\x12\x39\n\x0e\x43ollectNetInfo\x12\x16.CollectNetInfoRequest\x1a\r.BaseResponse\"\x00\x62\x06proto3')



_CREATESERVERREQUEST = DESCRIPTOR.message_types_by_name['CreateServerRequest']
_CREATESERVERRESPONSE = DESCRIPTOR.message_types_by_name['CreateServerResponse']
_COLLECTCOLLECTMEMORYREQUEST = DESCRIPTOR.message_types_by_name['CollectCollectMemoryRequest']
_COLLECTCPUINFOREQUEST = DESCRIPTOR.message_types_by_name['CollectCPUInfoRequest']
_COLLECTNETINFOREQUEST = DESCRIPTOR.message_types_by_name['CollectNetInfoRequest']
CreateServerRequest = _reflection.GeneratedProtocolMessageType('CreateServerRequest', (_message.Message,), {
  'DESCRIPTOR' : _CREATESERVERREQUEST,
  '__module__' : 'lrcp.grpc_data.server_pb2'
  # @@protoc_insertion_point(class_scope:CreateServerRequest)
  })
_sym_db.RegisterMessage(CreateServerRequest)

CreateServerResponse = _reflection.GeneratedProtocolMessageType('CreateServerResponse', (_message.Message,), {
  'DESCRIPTOR' : _CREATESERVERRESPONSE,
  '__module__' : 'lrcp.grpc_data.server_pb2'
  # @@protoc_insertion_point(class_scope:CreateServerResponse)
  })
_sym_db.RegisterMessage(CreateServerResponse)

CollectCollectMemoryRequest = _reflection.GeneratedProtocolMessageType('CollectCollectMemoryRequest', (_message.Message,), {
  'DESCRIPTOR' : _COLLECTCOLLECTMEMORYREQUEST,
  '__module__' : 'lrcp.grpc_data.server_pb2'
  # @@protoc_insertion_point(class_scope:CollectCollectMemoryRequest)
  })
_sym_db.RegisterMessage(CollectCollectMemoryRequest)

CollectCPUInfoRequest = _reflection.GeneratedProtocolMessageType('CollectCPUInfoRequest', (_message.Message,), {
  'DESCRIPTOR' : _COLLECTCPUINFOREQUEST,
  '__module__' : 'lrcp.grpc_data.server_pb2'
  # @@protoc_insertion_point(class_scope:CollectCPUInfoRequest)
  })
_sym_db.RegisterMessage(CollectCPUInfoRequest)

CollectNetInfoRequest = _reflection.GeneratedProtocolMessageType('CollectNetInfoRequest', (_message.Message,), {
  'DESCRIPTOR' : _COLLECTNETINFOREQUEST,
  '__module__' : 'lrcp.grpc_data.server_pb2'
  # @@protoc_insertion_point(class_scope:CollectNetInfoRequest)
  })
_sym_db.RegisterMessage(CollectNetInfoRequest)

_SERVERSERVICER = DESCRIPTOR.services_by_name['ServerServicer']
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _CREATESERVERREQUEST._serialized_start=58
  _CREATESERVERREQUEST._serialized_end=141
  _CREATESERVERRESPONSE._serialized_start=143
  _CREATESERVERRESPONSE._serialized_end=182
  _COLLECTCOLLECTMEMORYREQUEST._serialized_start=184
  _COLLECTCOLLECTMEMORYREQUEST._serialized_end=268
  _COLLECTCPUINFOREQUEST._serialized_start=270
  _COLLECTCPUINFOREQUEST._serialized_end=345
  _COLLECTNETINFOREQUEST._serialized_start=347
  _COLLECTNETINFOREQUEST._serialized_end=422
  _SERVERSERVICER._serialized_start=425
  _SERVERSERVICER._serialized_end=729
# @@protoc_insertion_point(module_scope)

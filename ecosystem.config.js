const extraData = {
  version: "1.0.0",
  namespace: "LRCP",
  cwd: '/home/lradmin/lrcp'
}


module.exports = {
  apps : [{
    name   : "lrcp_api",
    script : "poetry run uvicorn lrcp.api.app:app --host 0.0.0.0 --port 8000",
    exec_mode: "fork",
    error_file: "/var/logs/lrcp/api/error.log",
    out_file: "/var/logs/lrcp/api/out.log",
    pid_file: "./pids/api.pid",
    combine_logs: false,
    ...extraData
  },{
    name   : "lrcp_client",
    script : "poetry run manage client run",
    exec_mode: "fork",
    error_file: "/var/logs/lrcp/client/error.log",
    out_file: "/var/logs/lrcp/client/out.log",
    pid_file: "./pids/client.pid",
    combine_logs: false,
    ...extraData
  },{
    name   : "lrcp_server",
    script : "poetry run manage server run",
    exec_mode: "fork",
    error_file: "/var/logs/lrcp/server/error.log",
    out_file: "/var/logs/lrcp/server/out.log",
    pid_file: "./pids/server.pid",
    combine_logs: false,
    ...extraData
  }]
}

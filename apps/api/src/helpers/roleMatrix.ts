import { T_UserRole, ZUserRoles } from "custom-validator"

const roleMatrix = {
  controller: {
    start_when_production_ended: [
      ZUserRoles.Values.Administrator,
      ZUserRoles.Values.Super,
    ] as T_UserRole[],
  },
}

export default roleMatrix

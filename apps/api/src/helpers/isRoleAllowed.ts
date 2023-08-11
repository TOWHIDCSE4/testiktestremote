import { NextFunction, Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import { keys } from "../config/keys"

const isRoleAllowed = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"]
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ")
      const bearerToken = bearer[1]
      const { email, role }: any = jwt.verify(
        bearerToken,
        keys.signKey as Secret
      )
      const checkAllRole = (allRoles: string[]) => {
        const roleExist = allRoles.filter(
          (currentRole: string) => currentRole === role
        )
        if (roleExist.length > 0) {
          next()
        } else {
          res.json({
            error: true,
            message: "Unauthorized access",
          })
        }
      }
      checkAllRole(roles)
    }
  }
}

export default isRoleAllowed

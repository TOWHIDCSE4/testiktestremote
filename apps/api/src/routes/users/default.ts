import express from "express"
import { Request, Response } from "express"
import Users from "../../models/users"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
} from "../../utils/constants"
import CryptoJS from "crypto-js"
import { keys } from "../../config/keys"
import isEmpty from "lodash/isEmpty"

export const getAllUsers = async (req: Request, res: Response) => {}

export const getUser = async (req: Request, res: Response) => {}

export const addUser = async (req: Request, res: Response) => {}

export const updateUser = async (req: Request, res: Response) => {}

export const deleteUser = async (req: Request, res: Response) => {}

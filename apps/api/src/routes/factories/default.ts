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

export const getAllFactories = async (req: Request, res: Response) => {}

export const getFactory = async (req: Request, res: Response) => {}

export const addFactory = async (req: Request, res: Response) => {}

export const updateFactory = async (req: Request, res: Response) => {}

export const delteFactory = async (req: Request, res: Response) => {}

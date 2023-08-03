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

export const getAllParts = async (req: Request, res: Response) => {}

export const getPart = async (req: Request, res: Response) => {}

export const addPart = async (req: Request, res: Response) => {}

export const updatePart = async (req: Request, res: Response) => {}

export const deletePart = async (req: Request, res: Response) => {}

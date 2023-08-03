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

export const getAllLocations = async (req: Request, res: Response) => {}

export const getLocation = async (req: Request, res: Response) => {}

export const addLocation = async (req: Request, res: Response) => {}

export const updateLocation = async (req: Request, res: Response) => {}

export const deleteLocation = async (req: Request, res: Response) => {}

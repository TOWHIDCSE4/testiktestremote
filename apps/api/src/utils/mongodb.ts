import mongoose from "mongoose"
import { mongoURL } from "../config"
import { getCronJobList } from "./cronJobManager"
import { initAllCronJobs } from "../services/autoTimerService"

mongoose
  .connect(mongoURL)
  .then(async () => {
    console.log("MONGODB is running")
    //FIXME: should move this method to proper place
    await initAllCronJobs()
    console.log(getCronJobList())
  })
  .catch((err) => console.log("MONGODB error: " + err))

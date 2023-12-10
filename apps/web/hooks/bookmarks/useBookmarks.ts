import { API_URL_BOOKMARK } from "../../helpers/constants"
import Cookies from "js-cookie"
import toast from "react-hot-toast"

interface IBookmark {
  modelId: string
  modelName: string
  userId: string
}

export const useBookmarks = () => {
  const getBookmarks = async () => {
    const token = Cookies.get("tfl")
    const res = await fetch(`${API_URL_BOOKMARK}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()

    console.log(data)
    return data
  }

  const addBookmark = async (bookmark: IBookmark) => {
    const token = Cookies.get("tfl")
    const res = await fetch(`${API_URL_BOOKMARK}`, {
      method: "POST",
      body: JSON.stringify(bookmark),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    return await res.json()
  }

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const token = Cookies.get("tfl")
      const res = await fetch(`${API_URL_BOOKMARK}/${bookmarkId}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const response = await res.json()
      if (response.error) {
        toast.error(String(response.message))
      } else {
        toast.success(String(response.message))

        return response
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.success(String(error.message))
      } else {
        toast.success(String(error))
      }
    }
  }

  return {
    addBookmark,
    getBookmarks,
    deleteBookmark,
  }
}

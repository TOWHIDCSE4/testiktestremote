// import { API_URL_VERIFIED_PART } from "../../helpers/constants";
// import { useMutation } from "@tanstack/react-query";
// import Cookies from "js-cookie";

// export async function updateVerifiedPart( partId: string ) {
//   const token = Cookies.get("tfl");
//   const res = await fetch(`${API_URL_VERIFIED_PART}/${partId}`, {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return await res.json();
// }

// function useVerifiedPart(partId: string) {
//   const mutation = useMutation((partId) => updateVerifiedPart(partId));
//   return mutation;
// }

// export default useVerifiedPart;

import { API_URL_JOBS, API_URL_VERIFIED_PART } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateVerifiedPart(partId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_VERIFIED_PART}/${partId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useVerifiedPart() {
  const query = useMutation((partId: string) => updateVerifiedPart(partId))
  return query
}

export default useVerifiedPart

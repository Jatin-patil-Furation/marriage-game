import * as types from "./ActionTypes";
import axios, { AxiosResponse } from "axios";
import { Dispatch } from "@reduxjs/toolkit";
import {Baseurl} from "./api"
//  console.log("Baseurl",Baseurl)

const getLoginreq = () => {
  return {
    type: types.LOGINUSERREQ,
  };
};

const getLoginsuccess = (payload: AxiosResponse<any, any>) => {
  return {
    type: types.LOGINUSERSUCESS,
    payload,
  };
};

const getLoginfailure = () => {
  return {
    type: types.LOGINUSERFAILURE,
  };
};

// -------------

const getsignReq = () => {
  return {
    type: types.SIGNUPUSERREQ,
  };
};

const getsignSucess = (payload: AxiosResponse<any, any>) => {
  return {
    type: types.SIGNUPUSERSUCESS,
    payload,
  };
};

const getsignFail = () => {
  return {
    type: types.SIGNUPUSERFAILURE,
  };
};

// -------------- User for getting prsigned url aws Avatar updated -----------------

const UservatarReq = () => {
  return {
    type: types.USERUPDATEDAVATARREQ,
  };
};

const UservatarSucess = (payload: AxiosResponse<any, any>) => {
  return {
    type: types.USERUPDATEDAVATARSUCESS,
    payload,
  };
};

const UservatarFail = () => {
  return {
    type: types.USERUPDATEDAVATARFAILURE,
  };
};
// ------------ Put  -----------

const updatedpostReq = () => {
  return {
    type: types.USEREDIT_DATA_REQUEST,
  };
};
const updateducess = (payload: AxiosResponse<any, any>) => {
  return {
    type: types.USEREDIT_DATA_SUCESS,
    payload,
  };
};
const updatedFail = () => {
  return {
    type: types.USEREDIT_DATA_FAILURE,
  };
};

// User image updated and any iformation

const updatedpostimageReq = () => {
  return {
    type: types.USEREDIT_IMAGE_REQUEST,
  };
};
const updatedimageucess = (payload: AxiosResponse<any, any>) => {
  return {
    type: types.USEREDIT_IMAGE_SUCESS,
    payload,
  };
};
const updatedimageFail = () => {
  return {
    type: types.USEREDIT_IMAGE_FAILURE,
  };
};

//  delete User Account
const DeleteuserReq = () => {
  return {
    type: types.DELETEUSERREQ,
  };
};
const Deleteuserucess = () => {
  return {
    type: types.DELETEUSERSUCESS,
  };
};
const DeleteuserFail = () => {
  return {
    type: types.DELETENUSERFAILURE,
  };
};

 // --------------------------- phone-login -------------------------
  const PhoneLoginreq = () => {
    return {
      type: types.PHONELOGINUSERREQ,
    };
  };

  const PhoneLoginsuccess = (payload: AxiosResponse<any, any>) => {
    return {
      type: types.PHONELOGINUSERSUCESS,
      payload,
    };
  };

  const PhoneLoginfailure = () => {
    return {
      type: types.PHONELOGINUSERFAILURE,
    };
  };

      // Phonelogin request
export const Phoneloginpost = (payload: any) => (dispatch: Dispatch) => {
  dispatch(PhoneLoginreq());
  return axios
    .post(`${Baseurl}/user/phone-login`, payload)
    .then((r) => {
      return dispatch(PhoneLoginsuccess(r.data));
    })
    .catch((err) => {
      return dispatch(PhoneLoginfailure());
    });
};



// login request
export const Loginpost = (payload: any) => (dispatch: Dispatch) => {
  dispatch(getLoginreq());
  return axios
    .post(`${Baseurl}/user/login`, payload)
    .then((r) => {
      return dispatch(getLoginsuccess(r.data));
    })
    .catch((err) => {
      return dispatch(getLoginfailure());
    });
};

//  Signup request

export const Signuppost = (payload: any) => (dispatch: Dispatch) => {
  dispatch(getsignReq());
  return axios
    .post(`${Baseurl}/user/create`, payload)
    .then((r) => {
      return dispatch(getsignSucess(r.data));
    })
    .catch((err) => {
      return dispatch(getsignFail());
    });
};

//  Get preSigned url

export const GetpresignedurlData = (param: any) => (dispatch: Dispatch) => {
  dispatch(UservatarReq());
  return axios
    .get(`${Baseurl}/aws/getpresignedurl/${param}`)
    .then((r) => {
      return dispatch(UservatarSucess(r.data));
    })
    .catch((err) => {
      return dispatch(UservatarFail());
    });
};

// Aws images  updated

export const UpdatedPost =
  (apiurl: any, payload: any) => (dispatch: Dispatch) => {
    dispatch(updatedpostReq());
    return axios
      .put(apiurl, payload)
      .then((res) => {
        return dispatch(updateducess(res.data));
      })
      .catch((e) => {
        return dispatch(updatedFail());
      });
  };

//   User profile updated and images

export const UpdatedImage = (payload: any) => (dispatch: Dispatch) => {
  interface Usertoken {
    token: string;
  }

  const utoken = localStorage.getItem("token");
  const token: Usertoken | null = utoken ? JSON.parse(utoken) : null;

  dispatch(updatedpostimageReq());
  return axios
    .put(`${Baseurl}/user/update`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return dispatch(updatedimageucess(res.data));
    })
    .catch((e) => {
      return dispatch(updatedimageFail());
    });
};

//  delete user  Account
export const DeleteuserAccount = (id: any) => (dispatch: Dispatch) => {
  interface Usertoken {
    token: string;
  }

  const utoken = localStorage.getItem("token");
  const token: Usertoken | null = utoken ? JSON.parse(utoken) : null;

  dispatch(DeleteuserReq());
   return axios
     .put(`${Baseurl}/user/delete/${id}`, {
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
     })
     .then((res) => {
       return dispatch(Deleteuserucess());
     })
     .catch((e) => {
       return dispatch(DeleteuserFail());
     });
};

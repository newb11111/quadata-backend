// utils/response.js
export const ok = (res, data = {}, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const bad = (res, message = "Bad Request", status = 400) => {
  return res.status(status).json({ success: false, message });
};

export const err = (res, message = "Server Error", status = 500) => {
  return res.status(status).json({ success: false, message });
};

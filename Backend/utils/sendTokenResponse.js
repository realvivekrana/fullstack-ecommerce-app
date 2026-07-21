import generateToken from './generateToken.js';

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  const expiresInDays = parseInt(process.env.JWT_EXPIRES_IN) || 7;

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    message,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      token,
    },
  });
};

export default sendTokenResponse;
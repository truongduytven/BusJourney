import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Account from '../models/Accounts';
import Role from '../models/Role';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interface cho payload của JWT
interface JwtPayload {
  accountId: string;
  email: string;
  roleId: string;
  companyId: string;
}

// Extend Request interface để thêm user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware xác thực JWT token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      req.user = decoded as JwtPayload;
      next();
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Middleware kiểm tra role admin
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const roleAccount = await Role.query().findOne({ id: req.user.roleId });

  if (roleAccount?.name !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

/**
 * Middleware kiểm tra owner hoặc admin
 */
export const requireOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const targetAccountId = req.params.accountId || req.body.accountId;
  
  // Cho phép nếu là admin hoặc đang thao tác trên tài khoản của chính mình
  if (req.user.roleId === 'admin' || req.user.roleId === '1' || req.user.accountId === targetAccountId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
};
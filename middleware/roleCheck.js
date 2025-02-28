function checkRole(requiredRole) {
    return (req, res, next) => {
      console.log(`Checking role: ${req.user.role} against required role: ${requiredRole}`);
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Доступ заборонено' });
      }
      next();
    };
  }

 module.exports = checkRole;
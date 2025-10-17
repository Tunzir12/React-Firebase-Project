import db from '../config/firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
      return res.status(400).json({ 
        error: 'Please provide email, password, and userName' 
      });
    }

    // Step 6: Check if user already exists
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (!snapshot.empty) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Step 7: Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 8: Create user in Firestore
    const userData = {
      userName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    const userRef = await usersRef.add(userData);

    // Step 9: Generate JWT token
    const token = jwt.sign(
      { 
        userId: userRef.id, 
        email: email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Step 10: Send response
    res.status(201).json({
      message: 'User created successfully!',
      token,
      user: {
        id: userRef.id,
        userName: userName,
        email: email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Step 11: Login function
export const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    // Step 12: Get login credentials
    const { email, password } = req.body;

    // Step 13: Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    // Step 14: Find user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Step 15: Get user data
    const userDoc = snapshot.docs[0];
    const user = { 
      id: userDoc.id, 
      ...userDoc.data() 
    };

    // Step 16: Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Step 17: Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Step 18: Send response
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
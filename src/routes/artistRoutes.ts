import { Router, RequestHandler } from 'express';
import { AppDataSource } from '../config/database';
import { Artist } from '../models/Artist';
import { authenticateJWT } from '../middleware/authMiddleware';
import { uploadArtistImage, handleUploadError } from '../middleware/uploadMiddleware';
import path from 'path';
import fs from 'fs';

const router = Router();
const artistRepository = AppDataSource.getRepository(Artist);

interface ArtistParams {
  id: string;
}

/**
 * @swagger
 * tags:
 *   - name: Artists
 *     description: Artist management
 * /api/artists:
 *   get:
 *     summary: Retrieve a list of artists
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: A list of artists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Create a new artist
 *     tags: [Artists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Artist created
 *       500:
 *         description: Error creating artist
 *
 * /api/artists/{id}:
 *   get:
 *     summary: Get an artist by ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Artist found
 *       404:
 *         description: Artist not found
 *   put:
 *     summary: Update an artist by ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Artist updated
 *       404:
 *         description: Artist not found
 *   delete:
 *     summary: Delete an artist by ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Artist deleted
 *       404:
 *         description: Artist not found
 */

// Get all artists
const getAllArtists: RequestHandler = async (_req, res) => {
  try {
    const artists = await artistRepository.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists' });
  }
};

// Get artist by ID
const getArtistById: RequestHandler = async (req, res) => {
  try {
    const artist = await artistRepository.findOne({ where: { id: req.params.id } });
    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist' });
  }
};

// Create artist
const createArtist: RequestHandler = async (req, res) => {
  try {
    console.log('Backend: Creating artist with data:', req.body);
    
    const artist = artistRepository.create(req.body);
    console.log('Backend: Created artist entity:', artist);
    
    const result = await artistRepository.save(artist);
    console.log('Backend: Saved artist result:', result);
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Backend: Error creating artist:', error);
    res.status(500).json({ message: 'Error creating artist' });
  }
};

// Update artist
const updateArtist: RequestHandler = async (req, res) => {
  try {
    const artist = await artistRepository.findOne({ where: { id: req.params.id } });
    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }
    artistRepository.merge(artist, req.body);
    const result = await artistRepository.save(artist);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating artist' });
  }
};

// Delete artist
const deleteArtist: RequestHandler = async (req, res) => {
  try {
    const artist = await artistRepository.findOne({ where: { id: req.params.id } });
    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }
    await artistRepository.remove(artist);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting artist' });
  }
};

// Upload artist image
const handleArtistImageUpload: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size exceeds 5MB limit' });
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' });
    }

    // Create file path relative to uploads directory
    const filePath = `/uploads/artists/${req.file.filename}`;
    
    res.status(201).json({
      message: 'Artist image uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: filePath
      }
    });
  } catch (error) {
    console.error('Artist image upload error:', error);
    res.status(500).json({ message: 'Error uploading artist image' });
  }
};

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.post('/', authenticateJWT, createArtist);
router.post('/upload-image', authenticateJWT, uploadArtistImage, handleUploadError, handleArtistImageUpload);
router.put('/:id', authenticateJWT, updateArtist);
router.delete('/:id', authenticateJWT, deleteArtist);

export default router; 
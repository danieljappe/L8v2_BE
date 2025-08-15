import { Router, RequestHandler } from 'express';
import { AppDataSource } from '../config/database';
import { GalleryImage } from '../models/GalleryImage';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();
const galleryImageRepository = AppDataSource.getRepository(GalleryImage);

interface GalleryImageParams {
  id: string;
}

/**
 * @swagger
 * tags:
 *   - name: Gallery
 *     description: Gallery image management
 * /api/gallery:
 *   get:
 *     summary: Retrieve a list of gallery images
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: A list of gallery images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Create a new gallery image
 *     tags: [Gallery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Gallery image created
 *       500:
 *         description: Error creating gallery image
 *
 * /api/gallery/{id}:
 *   get:
 *     summary: Get a gallery image by ID
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gallery image found
 *       404:
 *         description: Gallery image not found
 *   put:
 *     summary: Update a gallery image by ID
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Gallery image updated
 *       404:
 *         description: Gallery image not found
 *   delete:
 *     summary: Delete a gallery image by ID
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Gallery image deleted
 *       404:
 *         description: Gallery image not found
 */

// Get all gallery images
const getAllGalleryImages: RequestHandler = async (_req, res) => {
  try {
    const galleryImages = await galleryImageRepository.find();
    res.json(galleryImages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery images' });
  }
};

// Get gallery image by ID
const getGalleryImageById: RequestHandler = async (req, res) => {
  try {
    const galleryImage = await galleryImageRepository.findOne({
      where: { id: req.params.id }
    });
    if (!galleryImage) {
      res.status(404).json({ message: 'Gallery image not found' });
      return;
    }
    res.json(galleryImage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery image' });
  }
};

// Create gallery image
const createGalleryImage: RequestHandler = async (req, res) => {
  try {
    const galleryImage = galleryImageRepository.create(req.body);
    const result = await galleryImageRepository.save(galleryImage);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating gallery image' });
  }
};

// Update gallery image
const updateGalleryImage: RequestHandler = async (req, res) => {
  try {
    const galleryImage = await galleryImageRepository.findOne({
      where: { id: req.params.id }
    });
    if (!galleryImage) {
      res.status(404).json({ message: 'Gallery image not found' });
      return;
    }
    galleryImageRepository.merge(galleryImage, req.body);
    const result = await galleryImageRepository.save(galleryImage);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery image' });
  }
};

// Delete gallery image
const deleteGalleryImage: RequestHandler = async (req, res) => {
  try {
    const galleryImage = await galleryImageRepository.findOne({
      where: { id: req.params.id }
    });
    if (!galleryImage) {
      res.status(404).json({ message: 'Gallery image not found' });
      return;
    }
    await galleryImageRepository.remove(galleryImage);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery image' });
  }
};

router.get('/', getAllGalleryImages);
router.get('/:id', getGalleryImageById);
router.post('/', authenticateJWT, createGalleryImage);
router.put('/:id', authenticateJWT, updateGalleryImage);
router.delete('/:id', authenticateJWT, deleteGalleryImage);

export default router; 
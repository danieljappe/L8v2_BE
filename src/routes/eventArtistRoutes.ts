import { Router, RequestHandler } from 'express';
import { AppDataSource } from '../config/database';
import { EventArtist } from '../models/EventArtist';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();
const eventArtistRepository = AppDataSource.getRepository(EventArtist);

/**
 * @swagger
 * tags:
 *   - name: Event-Artists
 *     description: Event-Artist relationship management
 * /api/event-artists:
 *   get:
 *     summary: Retrieve a list of event-artist relationships
 *     tags: [Event-Artists]
 *     responses:
 *       200:
 *         description: A list of event-artist relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Create a new event-artist relationship
 *     tags: [Event-Artists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Event-artist relationship created
 *       500:
 *         description: Error creating event-artist relationship
 *
 * /api/event-artists/{id}:
 *   get:
 *     summary: Get an event-artist relationship by ID
 *     tags: [Event-Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event-artist relationship found
 *       404:
 *         description: Event-artist relationship not found
 *   put:
 *     summary: Update an event-artist relationship by ID
 *     tags: [Event-Artists]
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
 *         description: Event-artist relationship updated
 *       404:
 *         description: Event-artist relationship not found
 *   delete:
 *     summary: Delete an event-artist relationship by ID
 *     tags: [Event-Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Event-artist relationship deleted
 *       404:
 *         description: Event-artist relationship not found
 */

// Get all event artists
const getAllEventArtists: RequestHandler = async (_req, res) => {
  try {
    const eventArtists = await eventArtistRepository.find({
      relations: ['event', 'artist']
    });
    res.json(eventArtists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event artists' });
  }
};

// Get event artist by ID
const getEventArtistById: RequestHandler = async (req, res) => {
  try {
    const eventArtist = await eventArtistRepository.findOne({
      where: { id: req.params.id },
      relations: ['event', 'artist']
    });
    if (!eventArtist) {
      res.status(404).json({ message: 'Event artist not found' });
      return;
    }
    res.json(eventArtist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event artist' });
  }
};

// Create event artist
const createEventArtist: RequestHandler = async (req, res) => {
  try {
    const eventArtist = eventArtistRepository.create(req.body);
    const result = await eventArtistRepository.save(eventArtist);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event artist' });
  }
};

// Update event artist
const updateEventArtist: RequestHandler = async (req, res) => {
  try {
    const eventArtist = await eventArtistRepository.findOne({
      where: { id: req.params.id },
      relations: ['event', 'artist']
    });
    if (!eventArtist) {
      res.status(404).json({ message: 'Event artist not found' });
      return;
    }
    eventArtistRepository.merge(eventArtist, req.body);
    const result = await eventArtistRepository.save(eventArtist);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event artist' });
  }
};

// Delete event artist
const deleteEventArtist: RequestHandler = async (req, res) => {
  try {
    const eventArtist = await eventArtistRepository.findOne({
      where: { id: req.params.id },
      relations: ['event', 'artist']
    });
    if (!eventArtist) {
      res.status(404).json({ message: 'Event artist not found' });
      return;
    }
    await eventArtistRepository.remove(eventArtist);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event artist' });
  }
};

router.get('/', getAllEventArtists);
router.get('/:id', getEventArtistById);
router.post('/', authenticateJWT, createEventArtist);
router.put('/:id', authenticateJWT, updateEventArtist);
router.delete('/:id', authenticateJWT, deleteEventArtist);

export default router; 
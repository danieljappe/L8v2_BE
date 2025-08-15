import { Router, RequestHandler } from 'express';
import { AppDataSource } from '../config/database';
import { ContactMessage } from '../models/ContactMessage';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();
const contactMessageRepository = AppDataSource.getRepository(ContactMessage);

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Contact message management
 * /api/contact:
 *   get:
 *     summary: Retrieve a list of contact messages
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: A list of contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Contact message created
 *       500:
 *         description: Error creating contact message
 *
 * /api/contact/{id}:
 *   get:
 *     summary: Get a contact message by ID
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact message found
 *       404:
 *         description: Contact message not found
 *   put:
 *     summary: Update a contact message by ID
 *     tags: [Contact]
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
 *         description: Contact message updated
 *       404:
 *         description: Contact message not found
 *   delete:
 *     summary: Delete a contact message by ID
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contact message deleted
 *       404:
 *         description: Contact message not found
 */

// Get all contact messages
const getAllContactMessages: RequestHandler = async (_req, res) => {
  try {
    const contactMessages = await contactMessageRepository.find();
    res.json(contactMessages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact messages' });
  }
};

// Get contact message by ID
const getContactMessageById: RequestHandler = async (req, res) => {
  try {
    const contactMessage = await contactMessageRepository.findOne({
      where: { id: req.params.id }
    });
    if (!contactMessage) {
      res.status(404).json({ message: 'Contact message not found' });
      return;
    }
    res.json(contactMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact message' });
  }
};

// Create contact message
const createContactMessage: RequestHandler = async (req, res) => {
  try {
    const contactMessage = contactMessageRepository.create(req.body);
    const result = await contactMessageRepository.save(contactMessage);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact message' });
  }
};

// Update contact message
const updateContactMessage: RequestHandler = async (req, res) => {
  try {
    const contactMessage = await contactMessageRepository.findOne({
      where: { id: req.params.id }
    });
    if (!contactMessage) {
      res.status(404).json({ message: 'Contact message not found' });
      return;
    }
    contactMessageRepository.merge(contactMessage, req.body);
    const result = await contactMessageRepository.save(contactMessage);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact message' });
  }
};

// Delete contact message
const deleteContactMessage: RequestHandler = async (req, res) => {
  try {
    const contactMessage = await contactMessageRepository.findOne({
      where: { id: req.params.id }
    });
    if (!contactMessage) {
      res.status(404).json({ message: 'Contact message not found' });
      return;
    }
    await contactMessageRepository.remove(contactMessage);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact message' });
  }
};

router.get('/', getAllContactMessages);
router.get('/:id', getContactMessageById);
router.post('/', authenticateJWT, createContactMessage);
router.put('/:id', authenticateJWT, updateContactMessage);
router.delete('/:id', authenticateJWT, deleteContactMessage);

export default router; 
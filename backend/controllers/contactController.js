const Contact = require('../models/Contact');

// --- SUBMIT A CONTACT MESSAGE --- (Public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// --- GET ALL MESSAGES --- (Admin Only)
exports.getContacts = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// --- DELETE A MESSAGE --- (Admin Only)
exports.deleteContact = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};
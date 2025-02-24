const MeetingHistory = require('../../model/schema/meeting');
const mongoose = require('mongoose');

// Create a new meeting
const add = async (req, res) => {
    try {
        const { agenda, attendes, attendesLead, location, related, dateTime, notes, createBy } = req.body;

        if (!agenda || !createBy) {
            return res.status(400).json({ message: "Agenda and Created By are required." });
        }

        const newMeeting = new MeetingHistory({
            agenda,
            attendes,
            attendesLead,
            location,
            related,
            dateTime,
            notes,
            createBy
        });

        await newMeeting.save();
        res.status(201).json({ message: "Meeting created successfully", meeting: newMeeting });
    } catch (error) {
        res.status(500).json({ message: "Error creating meeting", error });
    }
};

// Get all meetings
const index = async (req, res) => {
    try {
        console.log("Fetching meetings...");
        const { createBy } = req.query;

        let query = { deleted: false };
        if (createBy) {
            query.createBy = createBy;
        }

        console.log("Query:", query);
        const meetings = await MeetingHistory.find(query)
            .populate('attendes')
            .populate('attendesLead')
            .populate('createBy');

        console.log("Meetings fetched:", meetings);
        res.status(200).json(meetings);
    } catch (error) {
        console.error("Error fetching meetings:", error.message, error.stack);
        res.status(500).json({ message: "Error fetching meetings", error: error.message });
    }
};


// Get a single meeting by ID
const view = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Meeting ID" });
        }

        const meeting = await MeetingHistory.findById(id)
            .populate('attendes')
            .populate('attendesLead')
            .populate('createBy');

        if (!meeting) return res.status(404).json({ message: "Meeting not found" });

        res.status(200).json(meeting);
    } catch (error) {
        res.status(500).json({ message: "Error fetching meeting", error });
    }
};

// Soft delete a meeting
const deleteData = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Meeting ID" });
        }

        const meeting = await MeetingHistory.findByIdAndUpdate(id, { deleted: true }, { new: true });

        if (!meeting) return res.status(404).json({ message: "Meeting not found" });

        res.status(200).json({ message: "Meeting deleted successfully", meeting });
    } catch (error) {
        res.status(500).json({ message: "Error deleting meeting", error });
    }
};

// Delete multiple meetings
const deleteMany = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of meeting IDs

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request, provide an array of IDs" });
        }

        await MeetingHistory.updateMany(
            { _id: { $in: ids } },
            { deleted: true }
        );

        res.status(200).json({ message: "Meetings deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting meetings", error });
    }
};

module.exports = { add, index, view, deleteData, deleteMany };

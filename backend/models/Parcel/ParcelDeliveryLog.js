import mongoose from 'mongoose';

const parcelDeliveryLogSchema = new mongoose.Schema({
    parcel_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parcel', // Adjust according to your parcel model
        required: true
    }]
});

const ParcelDeliveryLog = mongoose.model('ParcelDeliveryLog', parcelDeliveryLogSchema);

export default ParcelDeliveryLog;

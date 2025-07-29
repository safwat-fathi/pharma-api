import { NestFactory } from '@nestjs/core';

import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Pharmacy } from '../pharmacies/schemas/pharmacy.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const pharmacyModel = app.get<Model<Pharmacy>>(getModelToken(Pharmacy.name));

  console.log('Starting to seed pharmacies...');

  // Clear existing pharmacies
  await pharmacyModel.deleteMany({});
  // await pharmacyModel.db.dropCollection(Pharmacy.name);
  console.log('Cleared existing pharmacies.');

  const gizaPharmacies = [
    // 1st District (5 pharmacies)
    {
      name: 'El Ezaby Pharmacy - 1st District',
      whatsappNumber: '+201000000001',
      location: { type: 'Point', coordinates: [30.9399, 29.9631] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - 1st District',
      whatsappNumber: '+201000000002',
      location: { type: 'Point', coordinates: [30.9439, 29.9671] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    {
      name: '19011 Pharmacy - 1st District',
      whatsappNumber: '+201000000003',
      location: { type: 'Point', coordinates: [30.9359, 29.9591] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - 1st District',
      whatsappNumber: '+201000000004',
      location: { type: 'Point', coordinates: [30.9479, 29.9711] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    {
      name: 'Dawali Pharmacy - 1st District',
      whatsappNumber: '+201000000005',
      location: { type: 'Point', coordinates: [30.9319, 29.9551] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },

    // 2nd District (2 pharmacies)
    {
      name: 'El Ezaby Pharmacy - 2nd District',
      whatsappNumber: '+201000000006',
      location: { type: 'Point', coordinates: [30.9255, 29.9783] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - 2nd District',
      whatsappNumber: '+201000000007',
      location: { type: 'Point', coordinates: [30.9295, 29.9823] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },

    // 3rd District (7 pharmacies)
    {
      name: 'El Ezaby Pharmacy - 3rd District',
      whatsappNumber: '+201000000008',
      location: { type: 'Point', coordinates: [30.9152, 29.9524] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - 3rd District',
      whatsappNumber: '+201000000009',
      location: { type: 'Point', coordinates: [30.9192, 29.9564] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    {
      name: '19011 Pharmacy - 3rd District',
      whatsappNumber: '+201000000010',
      location: { type: 'Point', coordinates: [30.9112, 29.9484] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - 3rd District',
      whatsappNumber: '+201000000011',
      location: { type: 'Point', coordinates: [30.9232, 29.9604] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    {
      name: 'Dawali Pharmacy - 3rd District',
      whatsappNumber: '+201000000012',
      location: { type: 'Point', coordinates: [30.9072, 29.9444] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },
    {
      name: 'Tarik Ibn Ziad Pharmacy',
      whatsappNumber: '+201000000013',
      location: { type: 'Point', coordinates: [30.9272, 29.9644] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Al-Andalos Pharmacy',
      whatsappNumber: '+201000000014',
      location: { type: 'Point', coordinates: [30.9032, 29.9404] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },

    // 4th District (10 pharmacies)
    {
      name: 'El Ezaby Pharmacy - 4th District',
      whatsappNumber: '+201000000015',
      location: { type: 'Point', coordinates: [30.9501, 29.9452] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - 4th District',
      whatsappNumber: '+201000000016',
      location: { type: 'Point', coordinates: [30.9541, 29.9492] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    {
      name: '19011 Pharmacy - 4th District',
      whatsappNumber: '+201000000017',
      location: { type: 'Point', coordinates: [30.9461, 29.9412] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - 4th District',
      whatsappNumber: '+201000000018',
      location: { type: 'Point', coordinates: [30.9581, 29.9532] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    {
      name: 'Dawali Pharmacy - 4th District',
      whatsappNumber: '+201000000019',
      location: { type: 'Point', coordinates: [30.9421, 29.9372] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },
    {
      name: 'El-Fouad Pharmacy',
      whatsappNumber: '+201000000020',
      location: { type: 'Point', coordinates: [30.9621, 29.9572] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Roshdy Pharmacy',
      whatsappNumber: '+201000000021',
      location: { type: 'Point', coordinates: [30.9381, 29.9332] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    {
      name: 'El-Agzakhana Pharmacy',
      whatsappNumber: '+201000000022',
      location: { type: 'Point', coordinates: [30.9661, 29.9612] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Care Pharmacy',
      whatsappNumber: '+201000000023',
      location: { type: 'Point', coordinates: [30.9341, 29.9292] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    {
      name: 'Grand Pharmacy',
      whatsappNumber: '+201000000024',
      location: { type: 'Point', coordinates: [30.9701, 29.9652] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },

    // 5th District (8 pharmacies)
    {
      name: 'El Ezaby Pharmacy - 5th District',
      whatsappNumber: '+201000000025',
      location: { type: 'Point', coordinates: [30.9303, 29.9304] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - 5th District',
      whatsappNumber: '+201000000026',
      location: { type: 'Point', coordinates: [30.9343, 29.9344] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    {
      name: '19011 Pharmacy - 5th District',
      whatsappNumber: '+201000000027',
      location: { type: 'Point', coordinates: [30.9263, 29.9264] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - 5th District',
      whatsappNumber: '+201000000028',
      location: { type: 'Point', coordinates: [30.9383, 29.9384] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    {
      name: 'Dawali Pharmacy - 5th District',
      whatsappNumber: '+201000000029',
      location: { type: 'Point', coordinates: [30.9223, 29.9224] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },
    {
      name: 'October Pharmacy',
      whatsappNumber: '+201000000030',
      location: { type: 'Point', coordinates: [30.9423, 29.9424] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Zayed Pharmacy',
      whatsappNumber: '+201000000031',
      location: { type: 'Point', coordinates: [30.9183, 29.9184] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    {
      name: 'New Life Pharmacy',
      whatsappNumber: '+201000000032',
      location: { type: 'Point', coordinates: [30.9463, 29.9464] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },

    // 6th District (4 pharmacies)
    {
      name: 'El Ezaby Pharmacy - 6th District',
      whatsappNumber: '+201000000033',
      location: { type: 'Point', coordinates: [30.9105, 29.9706] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - 6th District',
      whatsappNumber: '+201000000034',
      location: { type: 'Point', coordinates: [30.9145, 29.9746] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    {
      name: '19011 Pharmacy - 6th District',
      whatsappNumber: '+201000000035',
      location: { type: 'Point', coordinates: [30.9065, 29.9666] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - 6th District',
      whatsappNumber: '+201000000036',
      location: { type: 'Point', coordinates: [30.9185, 29.9786] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
  ];

	const alexandriaPharmacies = [
    // Smouha
    {
      name: 'El Ezaby Pharmacy - Smouha',
      whatsappNumber: '+201000000037',
      location: { type: 'Point', coordinates: [29.9489, 31.2179] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - Smouha',
      whatsappNumber: '+201000000038',
      location: { type: 'Point', coordinates: [29.9539, 31.2139] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    // Roushdy
    {
      name: '19011 Pharmacy - Roushdy',
      whatsappNumber: '+201000000039',
      location: { type: 'Point', coordinates: [29.9694, 31.2444] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - Roushdy',
      whatsappNumber: '+201000000040',
      location: { type: 'Point', coordinates: [29.9744, 31.2404] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    // Gleem
    {
      name: 'Dawali Pharmacy - Gleem',
      whatsappNumber: '+201000000041',
      location: { type: 'Point', coordinates: [29.9605, 31.2355] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },
    {
      name: 'Al-Agzakhana Pharmacy - Gleem',
      whatsappNumber: '+201000000042',
      location: { type: 'Point', coordinates: [29.9655, 31.2315] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    // Sporting
    {
      name: 'El Ezaby Pharmacy - Sporting',
      whatsappNumber: '+201000000043',
      location: { type: 'Point', coordinates: [29.9402, 31.2202] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - Sporting',
      whatsappNumber: '+201000000044',
      location: { type: 'Point', coordinates: [29.9452, 31.2162] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    // Camp Caesar
    {
      name: '19011 Pharmacy - Camp Caesar',
      whatsappNumber: '+201000000045',
      location: { type: 'Point', coordinates: [29.9308, 31.2108] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - Camp Caesar',
      whatsappNumber: '+201000000046',
      location: { type: 'Point', coordinates: [29.9358, 31.2068] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    // Ibrahimeya
    {
      name: 'Dawali Pharmacy - Ibrahimeya',
      whatsappNumber: '+201000000047',
      location: { type: 'Point', coordinates: [29.9201, 31.2001] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },
    {
      name: 'Al-Agzakhana Pharmacy - Ibrahimeya',
      whatsappNumber: '+201000000048',
      location: { type: 'Point', coordinates: [29.9251, 31.1961] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    // Raml Station
    {
      name: 'El Ezaby Pharmacy - Raml Station',
      whatsappNumber: '+201000000049',
      location: { type: 'Point', coordinates: [29.9056, 31.1956] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - Raml Station',
      whatsappNumber: '+201000000050',
      location: { type: 'Point', coordinates: [29.9106, 31.1916] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
    // Miami
    {
      name: '19011 Pharmacy - Miami',
      whatsappNumber: '+201000000051',
      location: { type: 'Point', coordinates: [30.0003, 31.2853] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Misr Pharmacy - Miami',
      whatsappNumber: '+201000000052',
      location: { type: 'Point', coordinates: [30.0053, 31.2813] },
      serviceRadiusKm: 5,
      hours: '10am-12am',
    },
    // Mandara
    {
      name: 'Dawali Pharmacy - Mandara',
      whatsappNumber: '+201000000053',
      location: { type: 'Point', coordinates: [30.0207, 31.2957] },
      serviceRadiusKm: 5,
      hours: '8am-1am',
    },
    {
      name: 'Al-Agzakhana Pharmacy - Mandara',
      whatsappNumber: '+201000000054',
      location: { type: 'Point', coordinates: [30.0257, 31.2917] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    // Agami
    {
      name: 'El Ezaby Pharmacy - Agami',
      whatsappNumber: '+201000000055',
      location: { type: 'Point', coordinates: [29.7704, 31.1004] },
      serviceRadiusKm: 5,
      hours: '24/7',
    },
    {
      name: 'Seif Pharmacy - Agami',
      whatsappNumber: '+201000000056',
      location: { type: 'Point', coordinates: [29.7754, 31.0964] },
      serviceRadiusKm: 5,
      hours: '9am-11pm',
    },
  ];
	
	const allPharmacies = [...gizaPharmacies, ...alexandriaPharmacies]
  
	await pharmacyModel.insertMany(allPharmacies);

  console.log('Finished seeding pharmacies.');
  await app.close();
}

bootstrap();

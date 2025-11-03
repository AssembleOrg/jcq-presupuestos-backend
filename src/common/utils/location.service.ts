import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LocationService {
  async getLocationFromIp(ip: string): Promise<string> {
    try {
      // Skip localhost/private IPs
      if (ip === 'unknown' || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return 'Local';
      }

      // Use free IP geolocation service (you can replace with a paid service for production)
      const response = await axios.get(`http://ip-api.com/json/${ip}`, {
        timeout: 3000,
      });

      if (response.data && response.data.status === 'success') {
        const { city, regionName, country } = response.data;
        return `${city}, ${regionName}, ${country}`;
      }

      return 'Unknown';
    } catch (error) {
      console.error('Error getting location:', error.message);
      return 'Unknown';
    }
  }
}


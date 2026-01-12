const fs = require('fs').promises;
const path = require('path');

class DataManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeData(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async findById(id) {
    const data = await this.readData();
    return data.find(item => item.id === id);
  }

  async findAll() {
    return await this.readData();
  }

  async create(item) {
    const data = await this.readData();
    data.push(item);
    await this.writeData(data);
    return item;
  }

  async update(id, updates) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    data[index] = { ...data[index], ...updates };
    await this.writeData(data);
    return data[index];
  }

  async partialUpdate(id, updates) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Частичное обновление - только переданные поля
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        data[index][key] = updates[key];
      }
    });
    
    await this.writeData(data);
    return data[index];
  }

  async delete(id) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const deleted = data.splice(index, 1)[0];
    await this.writeData(data);
    return deleted;
  }
}

module.exports = DataManager;

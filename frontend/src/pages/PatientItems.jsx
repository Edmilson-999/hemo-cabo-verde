import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientItems, addItem } from '../services/api';

const PatientItems = () => {
  const { patientId } = useParams();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', imageUrl: '' });

  useEffect(() => {
    loadItems();
  }, [patientId]);

  const loadItems = async () => {
    try {
      const { data } = await getPatientItems(patientId);
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addItem(patientId, newItem);
      setNewItem({ name: '', imageUrl: '' });
      loadItems();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  return (
    <div>
      <h2>Itens do Paciente</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={newItem.imageUrl}
          onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
        />
        <button type="submit">Adicionar</button>
      </form>
      
      <div className="items-list">
        {items.map(item => (
          <div key={item.id} className="item">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              onError={(e) => e.target.style.display = 'none'}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientItems;
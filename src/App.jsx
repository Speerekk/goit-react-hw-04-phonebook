import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './components/ContactForm/ContactForm';
import ContactList from './components/ContactList/ContactList';
import Filter from './components/Filter/Filter';
import styles from './App.module.css';

const useLocalStorageState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const savedContacts = localStorage.getItem(key);
    return savedContacts ? JSON.parse(savedContacts) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const useInputState = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = event => {
    setValue(event.target.value);
  };

  return [value, handleChange];
};

const App = () => {
  const [contacts, setContacts] = useLocalStorageState('contacts', []);
  const [filter, setFilter] = useInputState('');
  const [name, setName] = useInputState('');
  const [number, setNumber] = useInputState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddContact = event => {
    event.preventDefault();

    const existingContact = contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (existingContact) {
      alert(`${name} уже есть в контактах.`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    setContacts(prevContacts => [...prevContacts, newContact]);
    setName('');
    setNumber('');
  };

  const handleChange = event => {
    setFilter(event.target.value);
  };

  const handleDeleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Телефонная книга</h1>

      <ContactForm
        name={name}
        number={number}
        onNameChange={setName}
        onNumberChange={setNumber}
        onSubmit={handleAddContact}
      />

      <h2 className={styles.subtitle}>Контакты</h2>

      <Filter value={filter} onChange={handleChange} />

      <ContactList
        contacts={filteredContacts}
        onDeleteContact={handleDeleteContact}
      />
    </div>
  );
};

export default App;

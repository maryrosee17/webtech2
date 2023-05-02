import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import "firebase/database";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Form } from 'react-bootstrap';

const firebaseConfig = {
  apiKey: "AIzaSyDOdhiWcljuocUvgNv_q_u_jX0QFUbBM5c",
  authDomain: "contacts-8fdbe.firebaseapp.com",
  projectId: "contacts-8fdbe",
  storageBucket: "contacts-8fdbe.appspot.com",
  messagingSenderId: "1041642582124",
  appId: "1:1041642582124:web:a2e08d21b78c44f929a849"
};

firebase.initializeApp(firebaseConfig);

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    const dbRef = firebase.database().ref('contacts');
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const contactsArray = Object.entries(data).map(([id, contact]) => ({
          id,
          ...contact,
        }));
        setContacts(contactsArray);
      } else {
        setContacts([]);
      }
    });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewContact((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddContact = () => {
    const dbRef = firebase.database().ref('contacts');
    dbRef.push(newContact);
    setNewContact({ name: '', email: '', phone: '' });
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setNewContact({ name: contact.name, email: contact.email, phone: contact.phone });
  };

  const handleUpdateContact = () => {
    const dbRef = firebase.database().ref(`contacts/${editingContact.id}`);
    dbRef.update(newContact);
    setEditingContact(null);
    setNewContact({ name: '', email: '', phone: '' });
  };

  const handleDeleteContact = (contact) => {
    const dbRef = firebase.database().ref(`contacts/${contact.id}`);
    dbRef.remove();
  };

  return (
    <div>
    <Card className='mt-5 mx-auto shadow mb-5' style={{ width: '500px', height: '450px'}}>
      <Card.Body>
        <h1>Contact List</h1>
        <Form>
          <Form.Group controlId="formName" className='mt-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={newContact.name} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formEmail" className='mt-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={newContact.email} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formPhone" className='mt-3'>
            <Form.Label>Phone</Form.Label>
            <Form.Control type="tel" name="phone" value={newContact.phone} onChange={handleInputChange} />
          </Form.Group>
          {!editingContact ? (
            <Button variant="dark" className="mt-4" onClick={handleAddContact}>
              Add Contact
            </Button>
          ) : (
            <Button variant="dark" className="mt-4" onClick={handleUpdateContact}>
              Update Contact
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
    <div>
        <Card className='mt-5 mx-auto shadow' style={{ width: '500px', height: '530px', overflowY: 'auto'}}>
        {contacts.map((contact) => (
          <Card key={contact.id} className='mx-auto mt-5 shadow' style={{ width: '400px', backgroundColor: '#e4e4e4'}}>
            <Card.Body>
              <Card.Title>{contact.name}</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {contact.email}
                <br />
                <strong>Phone:</strong> {contact.phone}
              </Card.Text>
              <Button variant="secondary" onClick={() => handleEditContact(contact)}>
                Edit
              </Button>{' '}
              <Button variant="danger" onClick={() => handleDeleteContact(contact)}>
                Delete
              </Button>
              </Card.Body>
              </Card>
            ))}
            </Card>
            <br></br><br></br>
          </div>
        </div>
      );
    };

export default ContactList;

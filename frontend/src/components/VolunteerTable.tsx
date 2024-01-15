import { useState, useEffect } from 'react';
import axios from 'axios';
import { Volunteer } from '../models/Volunteer';
import { Table, Switch, Stack, FormControlLabel, TablePagination, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';

function VolunteerTable() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [newVolunteer, setNewVolunteer] = useState({ name: '', avatar: '', hero_project: '', notes: '', email: '', phone: '', rating: '', status: false, id: '' });
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVolunteer, setEditVolunteer] = useState({ name: '', avatar: '', hero_project: '', notes: '', email: '', phone: '', rating: '', status: false, id: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
    axios.get<Volunteer[]>('http://localhost:5000/api/bog/users')
      .then(response => {
        setVolunteers(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  if (error) return <p>Error loading volunteers: {error}</p>;

  const addVolunteer = () => {
    setNewVolunteer({ ...newVolunteer, id: Date.now().toString() });
    setVolunteers([...volunteers, newVolunteer]);
    setNewVolunteer({  name: '', avatar: '', hero_project: '', notes: '', email: '', phone: '', rating: '', status: false, id: '' }); 
  };

  const deleteVolunteer = (volunteerId: string) => {
    setVolunteers(volunteers.filter(volunteer => volunteer.id !== volunteerId));
  };

  const startEdit = (volunteer: Volunteer) => {
    setEditingId(volunteer.id);
    setEditVolunteer({ ...volunteer });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = () => {
    if (editVolunteer) {
      setVolunteers(volunteers.map(vol => vol.id === editVolunteer.id ? editVolunteer : vol));
      cancelEdit();
    }
  };
  const handleNewVolunteerStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewVolunteer({ ...newVolunteer, status: event.target.checked });
  };

  const handleEditVolunteerStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editVolunteer) {
      setEditVolunteer({ ...editVolunteer, status: event.target.checked });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedVolunteers = volunteers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <div>
    <h1>Volunteer Table!</h1>
    <form>
        <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
        <TextField label="Name" variant="outlined" fullWidth value={newVolunteer.name} onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })} />
        <TextField label="Avatar" variant="outlined" fullWidth value={newVolunteer.avatar} onChange={(e) => setNewVolunteer({ ...newVolunteer, avatar: e.target.value })} />
        <TextField label="Phone" variant="outlined" fullWidth value={newVolunteer.phone} onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })} />
        <TextField label="Email" variant="outlined" fullWidth value={newVolunteer.email} onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })} />
        <TextField label="Rating" variant="outlined" fullWidth value={newVolunteer.rating} type="number" onChange={(e) => { if (/^\d*$/.test(e.target.value)) { setNewVolunteer({ ...newVolunteer, rating: e.target.value });}
  }}/>
        <FormControlLabel control={<Switch checked={newVolunteer.status} onChange={handleNewVolunteerStatusChange} />} label="Status" />
        <TextField label="Hero Project" variant="outlined" fullWidth value={newVolunteer.hero_project} onChange={(e) => setNewVolunteer({ ...newVolunteer, hero_project: e.target.value })} />
        </Stack>
        <Button variant="contained" color="primary" onClick={addVolunteer}>Add Volunteer</Button>
    </form>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Avatar</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Hero Project</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedVolunteers.map((volunteer) => (
            <TableRow key={volunteer.id}>
              {editingId === volunteer.id ? (
                <>
                  <TableCell>
                    <TextField
                      value={editVolunteer?.name}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, name: e.target.value })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      value={editVolunteer?.avatar}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, avatar: e.target.value })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      value={editVolunteer?.phone}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, phone: e.target.value })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      value={editVolunteer?.email}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, email: e.target.value })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      value={editVolunteer?.rating}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, rating: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                <Switch
                  checked={editVolunteer?.status || false}
                  onChange={handleEditVolunteerStatusChange}
                />
              </TableCell>
                  <TableCell align="right">
                    <TextField
                      value={editVolunteer?.hero_project}
                      onChange={(e) => setEditVolunteer({ ...editVolunteer, hero_project: e.target.value })}
                    />
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{volunteer.name}</TableCell>
                  <TableCell align="right">
                    <img src={volunteer.avatar} alt={volunteer.name} style={{ width: '50px', height: '50px' }} />
                  </TableCell>
                  <TableCell align="right">{volunteer.phone}</TableCell>
                  <TableCell align="right">{volunteer.email}</TableCell>
                  <TableCell align="right">{volunteer.rating}</TableCell>
                  <TableCell align="right">{volunteer.status ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="right">{volunteer.hero_project}</TableCell>
                </>
              )}
              <TableCell align="right">
                {editingId === volunteer.id ? (
                  <>
                    <Button onClick={saveEdit}>Save</Button>
                    <Button onClick={cancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => startEdit(volunteer)}>Edit</Button>
                    <Button onClick={() => deleteVolunteer(volunteer.id)}>Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
        component="div"
        count={volunteers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default VolunteerTable;

import React from "react"
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import {Button} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';


const initialRows = [
  {id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
  {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
  {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
  {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
  {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
  {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
  {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
  {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
  {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
];

var curId=10;

export default function DataGridDemo() {
  const [rows, setRows] = React.useState(initialRows);

  const onDeleteButtonClick = (e, id) => {
    e.stopPropagation();
    console.log('Delete row', id)
    setRows(rows.filter((initialRows) => initialRows.id !== id));
  };

  const columns = [
    {field: 'id', headerName: 'ID', width: 90},
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'actions', headerName: 'Actions', width: 400, renderCell: (params) => {
        return (
          <Button
            onClick={(e) => onDeleteButtonClick(e, params.row.id)}
            variant="contained"
          >
            Delete
          </Button>
        );
      }
    }
  ];

  const handleClick = () => {
    console.log('Adding new row', curId)
    setRows((oldRows) => [...oldRows, {id: curId, lastName: '', firstName: '', age: 0}]);
    curId++
  };

  return (
    <Box sx={{height: 800, width: '100%'}}>
      <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
        Add record
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
        experimentalFeatures={{newEditingApi: true}}
      />
    </Box>
  );
}
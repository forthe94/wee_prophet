import React from "react"
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import {Button, IconButton} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const initialRows = [
  {id: 1, deed_name: 'Зарядка', lastName: 'Snow', firstName: 'Jon', age: 35},
];

let curId=10;
function getDateWithDaysDiff(date, days) {
  date.setHours(0,0,0,0)
  date = new Date(date.getTime() + days * 86400000)
  return date.getFullYear()+'/'+('0' + (date.getMonth()+1)).slice(-2)+'/'+('0' + date.getDate()).slice(-2);
}
export default function DataGridDemo() {
  const [rows, setRows] = React.useState(initialRows);

  const onDeleteButtonClick = (e, id) => {
    e.stopPropagation();
    console.log('Delete row', id)
    setRows(rows.filter((initialRows) => initialRows.id !== id));
  };
  var nowDate = new Date();
  let columns = [
    {field: 'id', headerName: 'ID', hide: true},
    {field: 'deed_name', headerName: 'Название занятия', width: 250, editable: true},

  ]
  for (let day=-5; day < 5; day++) {
    columns.push({
      field: getDateWithDaysDiff(nowDate, day),
      headerName: getDateWithDaysDiff(nowDate, day),
      width: 100,
      editable: true,
    })
  }
  columns.push(
    {
      field: 'actions', headerName: 'Actions', width: 400, renderCell: (params) => {
        return (
          <IconButton>
            <DeleteIcon
              onClick={(e) => onDeleteButtonClick(e, params.row.id)}
              variant="contained"
            />
          </IconButton>
        );
      }
    }
  );

  const handleClick = () => {
    const getNextId = () => {
      let cur_id = 0;
      while (true) {
        let found = false;
        for (let ind = 0; ind < rows.length; ind++) {
          if (cur_id === rows[ind]['id']) {
            found = true;
            break
          }
        }
        if (found === false) return cur_id
        cur_id++
      }
    }
    console.log('Adding new row', curId)
    setRows((oldRows) => [...oldRows, {id: getNextId(), deed_name: 'Название дела', firstName: '', age: 0}]);
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
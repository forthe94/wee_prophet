import React, {useRef, useEffect} from "react"
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import {Button, IconButton} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import config from "../config.json";
const weekday = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
let initialRows = [
  {id: 0, deed_name: 'Настроение'},
];

function getDateWithDaysDiff(date, days, wd=false) {
  date.setHours(0, 0, 0, 0)
  date = new Date(date.getTime() + days * 86400000)
  let ret = date.getFullYear() + '/'
    + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
    + ('0' + date.getDate()).slice(-2)
  if (wd) ret += ' ' + weekday[date.getDay()]
  return ret

}

let date_keys = []
let date_headers = []
let nowDate = new Date();

for (let day = -5; day < 5; day++) {
  let date_key = getDateWithDaysDiff(nowDate, day)
  date_keys.push(date_key)
  date_headers.push(getDateWithDaysDiff(nowDate, day, true))
  initialRows[0][date_key] = '0'
}

function getDeedsFromBackend() {
  const token = localStorage.getItem('token')
  axios.post(
    config.SERVER_URL + '/get-deed-records',
    {
      'dates': date_keys
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => console.log(error));
}

export default function DataGridDemo() {
  const [rows, setRows] = React.useState(initialRows);
  const rowsState = useRef();
  useEffect(getDeedsFromBackend, []);
  // Из rowsState можно брать текущее состояние таблицы
  rowsState.current = rows
  const postToBackend = () => {
    let currentRows = rowsState.current
      let deeds = {}
      for (let cur_deed_name_ind = 0; cur_deed_name_ind < currentRows.length; cur_deed_name_ind++)
      {
        let deed_name = currentRows[cur_deed_name_ind]['deed_name']
        let vals = []
        for (let date_num = 0; date_num < date_keys.length; date_num++)
        {
          vals.push(currentRows[cur_deed_name_ind][date_keys[date_num]])
        }
        deeds[deed_name] = vals
      }
      const token = localStorage.getItem('token')

      axios.post(
        config.SERVER_URL + '/save-deed-records',
        {
          'dates': date_keys,
          'deeds': deeds
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => console.log(error));

  }
  const onDeleteButtonClick = (e, id) => {
    e.stopPropagation();
    postToBackend()
    setRows(rows.filter((initialRows) => initialRows.id !== id));
  };
  let columns = [
    {field: 'id', headerName: 'ID', hide: true},
    {field: 'deed_name', headerName: '', width: 250, editable: true},

  ]
  for (let day=0; day < 10; day++) {
    columns.push({
      field: date_keys[day],
      headerName: date_headers[day],
      width: 120,
      editable: true,
    })
  }
  columns.push(
    {
      field: 'actions', headerName: '', width: 400, renderCell: (params) => {
        if (params.row.id === 0) return null
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
    postToBackend()
    let newRow = {id: getNextId(), deed_name: 'Название дела'}
    for (let day = 0; day < 10; day++){
      newRow[date_keys[day]] = '0'
    }

    setRows((oldRows) => [...oldRows, newRow]);
  };
  const processRowUpdate = React.useCallback(
    async (newRow) => {
      postToBackend()

      setRows((oldRows) => {
        let rowInd = 0
        for (rowInd = 0; rowInd < oldRows.length; rowInd++) {
          if (oldRows[rowInd]['id'] === newRow['id']) break
        }
        let tmpRows = [...oldRows]
        tmpRows[rowInd] = newRow
        return tmpRows
      })
      return newRow
    },
    [],
  );
  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log('Error on row update')
  }, []);
  return (
    <Box sx={{height: 800, width: '100%'}}>
      <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
        Добавить занятие
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
        experimentalFeatures={{newEditingApi: true}}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
    </Box>
  );
}
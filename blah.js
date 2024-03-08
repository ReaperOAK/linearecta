let SHEET_ID = '1mIzhh-lR43e1QOrlLNWTqemGwM3B_Q80XQ13QJEJ5ZE';
// let SHEET_ID = '1qNc90Oh2qH8a5HLSkKAr9ZQgcjJnLQuUBZiIlIs8klE';
let SHEET_TITLE = 'Bluepages';
// let SHEET_TITLE = 'Sheet1';
let SHEET_RANGE = 'A:G';

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);

fetch(FULL_URL)
.then(res => res.text())
.then(rep => {
    let startIndex = rep.indexOf('(') + 1;
    let endIndex = rep.lastIndexOf(')');
    let jsonResponse = rep.substring(startIndex, endIndex);
    let data = JSON.parse(jsonResponse);

    let tableData = data.table;

    let table = document.getElementById('myTable');
    let thead = document.createElement('thead');
    let tbody = document.getElementById('tableBody');

    // Create table header
    let headerRow = document.createElement('tr');

for (let i = 0; i < tableData.rows[0].c.length; i++) {
    let th = document.createElement('th');
    th.textContent = tableData.rows[0].c[i].v || '';
    th.setAttribute('onclick', `sortTable(${i})`);
    headerRow.appendChild(th);
}


thead.appendChild(headerRow);
table.appendChild(thead);

// Create table rows
// Create table rows
for (let i = 1; i < tableData.rows.length; i++) {
  let tr = document.createElement('tr');
  for (let j = 0; j < tableData.rows[i].c.length; j++) {
      let td = document.createElement('td');
      let columnName = tableData.rows[0].c[j].v || '';
      if (j === 6) { // Add icon for the last column
          let icon = document.createElement('img');
          icon.src = 'https://www.svgrepo.com/show/522554/globe-2.svg';
          icon.style.cursor = 'pointer';
          icon.addEventListener('click', function() {
              window.open(tableData.rows[i].c[j].v, '_blank');
          });
          td.appendChild(icon);
      } else if (j === 1) { // Add icon for the second column
          let icon = document.createElement('span');
        //   icon.className = 'fab fa-instagram';
          icon.textContent="@";
          icon.style.cursor = 'pointer';
          icon.addEventListener('click', function() {
              window.open('https://www.instagram.com/' + tableData.rows[i].c[j].v, '_blank');
          });
          td.appendChild(icon);
      } else {
          td.textContent = (tableData.rows[i].c[j] && tableData.rows[i].c[j].v) ? tableData.rows[i].c[j].v : '';
      }
      td.setAttribute('data-label', columnName); // Set the data-label attribute here
      tr.appendChild(td);
  }
  tbody.appendChild(tr);
}
    table.appendChild(tbody);
})
.catch(error => {
    console.error('Error:', error);
});

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  document.getElementById('search_term').addEventListener('input', function() {
    let searchTerm = this.value.toLowerCase();
    filterTable(searchTerm);
});

function filterTable(searchTerm) {
    let table = document.getElementById('myTable');
    let tbody = table.getElementsByTagName('tbody')[0];
    let rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        let cells = row.getElementsByTagName('td');
        let found = false;
        for (let cell of cells) {
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                found = true;
                break;
            }
        }
        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

let selectedValues = {}; // Object to store selected values for each column

function filterTableByColumn(columnIndex, value) {
    selectedValues[columnIndex] = value.toLowerCase();
    let table = document.getElementById('myTable');
    let rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        let cells = row.getElementsByTagName('td');
        if (row.rowIndex === 0) continue; // Skip the header row
        let shouldDisplay = true;
        Object.keys(selectedValues).forEach(key => {
            let cellValue = cells[key].textContent.toLowerCase();
            let cellValuesArray = cellValue.split(',').map(item => item.trim()); // Split values by commas and trim whitespace
            if (selectedValues[key] !== "" && !cellValuesArray.includes(selectedValues[key])) {
                shouldDisplay = false;
            }
        });
        if (shouldDisplay) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

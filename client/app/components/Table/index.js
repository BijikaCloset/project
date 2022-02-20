/**
 *
 * Table
 *
 */

import React  from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {
  CSVExport,
  Search
} from 'react-bootstrap-table2-toolkit';

import useState from 'react'

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';

const indication = () => {
  return 'Oops! No data now! Please try again!';
};

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

class Table extends React.PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      editEvent : false,
      deleteEvent: false
    }
  }

  render() {
    const {
      data,
      columns,
      striped,
      hover,
      condensed,
      csv,
      search,
      clickAction,
      isRowEvents
    } = this.props;
  
    
  
  
  
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        clickAction(row._id, rowIndex);
        // console.log(row)
        // console.log(rowIndex)
  
        // this.setState({
        //   editEvent: true,
        //   deleteEvent: true
        // })
        
        
      }
    };
  
    return (
      <ToolkitProvider
        keyField='_id'
        data={data}
        columns={columns}
        exportCSV={csv}
        search={search}
      >
        {props => (
          <div className='table-section'>
            {csv && (
              <div className='csv'>
                <ExportCSVButton
                  className='input-btn custom-btn'
                  {...props.csvProps}
                >
                  Export CSV
                </ExportCSVButton>
              </div>
            )}
            {search && (
              <div className='search'>
                <SearchBar {...props.searchProps} />
              </div>
            )}
            {/* {
               this.state.deleteEvent  ? <DeleteOutlineIcon  onClick = {rowEvents} />   : ""
            } */}
            {/* {
               this.state.editEvent  ? <EditIcon onClick = {deleteProduct()} />   : ""
            } */}

            <p>For deleting anything just click on it</p>
            
            <BootstrapTable
              {...props.baseProps}
              keyField='_id'
              data={data}
              columns={columns}
              striped={striped}
              hover={hover}
              condensed={condensed}
              noDataIndication={indication}
              rowEvents={isRowEvents ? rowEvents : null}
            />

            
           
          </div>
        )}
      </ToolkitProvider>
    );

  }
  
};

export default Table;

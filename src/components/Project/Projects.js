import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReactTable from "react-table";
import "react-table/react-table.css";

import {connect} from "react-redux";

import {projectActions} from '../../store/actions';

class Projects extends Component {

    state = {
        data: [],
        pages: null,
        loading: true
    };

    componentDidMount(){


    }

    requestData = (pageSize =20, page =1, sorted, filtered) => {
        console.log(`pageSize :${pageSize}
        page:${page}
        sorted:${sorted}
        filtered:${filtered}`);

    }
    fetchData = (state, instance) => {

    }
    render() {
        const { data, pages, loading } = this.state;
        return (
            <div>
                <ReactTable
                    columns={[
                        {
                            Header: "First Name",
                            accessor: "firstName"
                        },
                        {
                            Header: "Last Name",
                            id: "lastName",
                            accessor: d => d.lastName
                        },
                        {
                            Header: "Age",
                            accessor: "age"
                        }
                    ]}
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    data={data}
                    pages={pages} // Display the total number of pages
                    loading={loading} // Display the loading overlay when we need it
                    onFetchData={this.fetchData} // Request new data when things change
                    filterable
                    defaultPageSize={10}
                    className="-striped -highlight"
                />

            </div>
        );
    }

}

Projects.propTypes = {};

const mapStateToProps = state => state.project;
export default connect(mapStateToProps, {...projectActions})(Projects);

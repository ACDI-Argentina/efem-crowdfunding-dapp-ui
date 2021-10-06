import React from 'react';
import Pagination from 'react-js-pagination';
import { Link } from 'react-router-dom';
import Loader from '../../Loader';
import { getTruncatedText } from '../../../lib/helpers';
import config from '../../../configuration';

import DAC from '../../../models/DAC';


const DacsSection = ({ userAddress, isLoadingDacs, dacs, visiblePages, handleDacPageChanged }) => {
  return (
    <>
      {(isLoadingDacs || (dacs && dacs.data.length > 0)) && <h4>Communities</h4>}
      <div className="table-container">
        {isLoadingDacs && <Loader className="small" />}

        {!isLoadingDacs && (
          <div>
            {dacs && dacs.data.length > 0 && (
              <div>
                <table className="table table-responsive table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="td-name">Name</th>
                      <th className="td-donations-number">Number of donations</th>
                      <th className="td-donations-amount">Amount donated</th>
                      <th className="td-status">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dacs.data.map(d => (
                      <tr key={d._id} className={d.status === DAC.PENDING ? 'pending' : ''}>
                        <td className="td-name">
                          <Link to={`/dacs/${d._id}`}>{getTruncatedText(d.title, 45)}</Link>
                          <div>
                            {d.ownerAddress === userAddress && (
                              <span className="badge badge-success">
                                <i className="fa fa-flag-o" />
                                Owner
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="td-donations-number">{d.donationCount}</td>
                        <td className="td-donations-amount">
                          {d.totalDonated || 0} {config.nativeTokenName}
                        </td>
                        <td className="td-status">
                          {d.status === DAC.PENDING && (
                            <span>
                              <i className="fa fa-circle-o-notch fa-spin" />
                              &nbsp;
                            </span>
                          )}
                          {d.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {dacs.total > dacs.limit && (
                  <center>
                    <Pagination
                      activePage={dacs.skipPages + 1}
                      itemsCountPerPage={dacs.limit}
                      totalItemsCount={dacs.total}
                      pageRangeDisplayed={visiblePages}
                      onChange={handleDacPageChanged}
                    />
                  </center>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default DacsSection;
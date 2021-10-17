import React from 'react';

import Pagination from 'react-js-pagination';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Loader from '../../Loader';
import Donation from '../../../models/Donation';


const DonationsSection = ({ isLoadingDonations, donations, visiblePages, handleDonationsPageChanged, etherScanUrl }) => {
  return (
    <>
      {(isLoadingDonations || (donations && donations.data.length > 0)) && (
        <h4>Donations</h4>
      )}
      <div className="table-container">
        {isLoadingDonations && <Loader className="small" />}

        {!isLoadingDonations && (
          <div>
            {donations && donations.data.length > 0 && (
              <div>
                <table className="table table-responsive table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="td-date">Date</th>
                      <th className="td-donated-to">Donated to</th>
                      <th className="td-donations-amount">Amount</th>
                      <th className="td-transaction-status">Status</th>
                      <th className="td-tx-address">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.data.map(d => (
                      <tr key={d.id} className={d.isPending ? 'pending' : ''}>
                        <td className="td-date">
                          {moment(d.createdAt).format('MM/DD/YYYY')}
                        </td>

                        <td className="td-donated-to">
                          {d.intendedProjectId > 0 && (
                            <span className="badge badge-info">
                              <i className="fa fa-random" />
                              &nbsp;Delegated
                            </span>
                          )}
                          <Link to={d.donatedTo.url}>
                            {d.donatedTo.type} <em>{d.donatedTo.name}</em>
                          </Link>
                        </td>
                        <td className="td-donations-amount">
                          {d.amount.toString()} {d.token.symbol}
                        </td>

                        <td className="td-transaction-status">
                          {d.isPending && (
                            <span>
                              <i className="fa fa-circle-o-notch fa-spin" />
                              &nbsp;
                            </span>
                          )}
                          {!d.isPending && d.amountRemaining > 0 && <span>{d.status}</span>}
                          {!d.isPending &&
                            d.amountRemaining === '0' &&
                            (d.delegateId ? 'Delegated' : Donation.COMMITTED)}
                        </td>

                        {etherScanUrl && (
                          <td className="td-tx-address">
                            <a href={`${etherScanUrl}address/${d.giverAddress}`}>
                              {d.giverAddress}
                            </a>
                          </td>
                        )}
                        {!etherScanUrl && (
                          <td className="td-tx-address">{d.giverAddress}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {donations.total > donations.limit && (
                  <center>
                    <Pagination
                      activePage={donations.skipPages + 1}
                      itemsCountPerPage={donations.limit}
                      totalItemsCount={donations.total}
                      pageRangeDisplayed={visiblePages}
                      onChange={handleDonationsPageChanged}
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

export default DonationsSection;
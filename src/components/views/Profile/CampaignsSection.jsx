import React from 'react';

import Pagination from 'react-js-pagination';
import { Link } from 'react-router-dom';
import Loader from '../../Loader';
import { getTruncatedText } from '../../../lib/helpers';
import Campaign from '../../../models/Campaign';
import config from '../../../configuration';


const CampaignsSection = ({userAddress, isLoadingCampaigns, campaigns, visiblePages, handleCampaignsPageChanged}) => {
  return (
    <>
      {(isLoadingCampaigns || (campaigns && campaigns.data.length > 0)) && (
        <h4>Campaigns</h4>
      )}
      <div className="table-container">
        {isLoadingCampaigns && <Loader className="small" />}

        {!isLoadingCampaigns && (
          <div className="table-container">
            {campaigns && campaigns.data.length > 0 && (
              <div>
                <table className="table table-responsive table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="td-name">Name</th>
                      <th className="td-donations-number">Donations</th>
                      <th className="td-donations-amount">Amount</th>
                      <th className="td-status">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.data.map(c => (
                      <tr
                        key={c._id}
                        className={c.status === Campaign.PENDING ? 'pending' : ''}
                      >
                        <td className="td-name">
                          <Link to={`/campaigns/${c._id}`}>
                            {getTruncatedText(c.title, 45)}
                          </Link>
                          <div>
                            {c.ownerAddress === userAddress && (
                              <span className="badge badge-success">
                                <i className="fa fa-flag-o" />
                                Owner
                              </span>
                            )}
                            {c.reviewerAddress === userAddress && (
                              <span className="badge badge-info">
                                <i className="fa fa-eye" />
                                Reviewer
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="td-donations-number">{c.donationCount || 0}</td>
                        <td className="td-donations-amount">
                          {c.totalDonated || 0} {config.nativeTokenName}
                        </td>
                        <td className="td-status">
                          {(c.status === Campaign.PENDING ||
                            (Object.keys(c).includes('mined') && !c.mined)) && (
                              <span>
                                <i className="fa fa-circle-o-notch fa-spin" />
                                &nbsp;
                              </span>
                            )}
                          {c.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {campaigns.total > campaigns.limit && (
                  <center>
                    <Pagination
                      activePage={campaigns.skipPages + 1}
                      itemsCountPerPage={campaigns.limit}
                      totalItemsCount={campaigns.total}
                      pageRangeDisplayed={visiblePages}
                      onChange={handleCampaignsPageChanged}
                    />
                  </center>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}


export default CampaignsSection;
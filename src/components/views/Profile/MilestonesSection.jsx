import React from 'react';

import Pagination from 'react-js-pagination';
import { Link } from 'react-router-dom';
import { utils } from 'web3';
import Loader from '../../Loader';
import { getTruncatedText, getReadableStatus } from '../../../lib/helpers';
import DateViewer from '../../DateViewer';

import moment from 'moment';
const reviewDue = updatedAt =>
  moment()
    .subtract(3, 'd')
    .isAfter(moment(updatedAt));

const MilestonesSection = ({ userAddress, isLoadingMilestones, milestones, visiblePages, handleMilestonePageChanged }) => {
  return (
    <>
      {(isLoadingMilestones || (milestones && milestones.data.length > 0)) && (
        <h4>Milestones</h4>
      )}
      <div className="table-container">
        {isLoadingMilestones && <Loader className="small" />}

        {!isLoadingMilestones && (
          <div className="table-container">
            {milestones && milestones.data.length > 0 && (
              <div>
                <table className="table table-responsive table-striped table-hover">
                  <thead>
                    <tr>
                      <th className="td-created-at">Created</th>
                      <th className="td-name">Name</th>
                      <th className="td-status">Status</th>
                      <th className="td-donations-number">Requested</th>
                      <th className="td-donations-number">Donations</th>
                      <th className="td-donations-amount">Donated</th>
                      <th className="td-reviewer">Reviewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.data.map(m => (
                      <tr key={m._id} className={m.status === 'Pending' ? 'pending' : ''}>
                        <td className="td-created-at">
                          {m.createdAt && (
                            <span><DateViewer value={m.createdAt} /></span>
                          )}
                        </td>
                        <td className="td-name">
                          <strong>
                            <Link to={`/campaigns/${m.campaign._id}/milestones/${m._id}`}>
                              MILESTONE <em>{getTruncatedText(m.title, 35)}</em>
                            </Link>
                          </strong>
                          <br />
                          <i className="fa fa-arrow-right" />
                          <Link
                            className="secondary-link"
                            to={`/campaigns/${m.campaign._id}`}
                          >
                            CAMPAIGN <em>{getTruncatedText(m.campaign.title, 40)}</em>
                          </Link>
                          <div>
                            {m.ownerAddress === userAddress && (
                              <span className="badge badge-success">
                                <i className="fa fa-flag-o" />
                                Owner
                              </span>
                            )}
                            {m.reviewerAddress === userAddress && (
                              <span className="badge badge-info">
                                <i className="fa fa-eye" />
                                Reviewer
                              </span>
                            )}
                            {m.recipientAddress === userAddress && (
                              <span className="badge badge-warning">
                                <i className="fa fa-diamond" />
                                Recipient
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="td-status">
                          {(m.status === 'Pending' ||
                            (Object.keys(m).includes('mined') && !m.mined)) && (
                              <span>
                                <i className="fa fa-circle-o-notch fa-spin" />
                                &nbsp;
                              </span>
                            )}
                          {m.status === 'NeedsReview' && reviewDue(m.updatedAt) && (
                            <span>
                              <i className="fa fa-exclamation-triangle" />
                              &nbsp;
                            </span>
                          )}
                          {getReadableStatus(m.status)}
                        </td>
                        <td className="td-donations-number">
                          {utils.fromWei(
                            m.maxAmount,
                          ) /* FIXME: this should not use fromWei but should tak into account decimals of the token */}{' '}
                          {m.token.symbol}
                        </td>
                        <td className="td-donations-number">{m.donationCount || 0}</td>
                        <td className="td-donations-amount">
                          {m.totalDonated} {m.token.symbol}
                        </td>
                        <td className="td-reviewer">
                          {m.reviewer && m.reviewerAddress && (
                            <Link to={`/profile/${m.reviewerAddress}`}>
                              {m.reviewer.name || 'Anomynous user'}
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {milestones.total > milestones.limit && (
                  <center>
                    <Pagination
                      activePage={milestones.skipPages + 1}
                      itemsCountPerPage={milestones.limit}
                      totalItemsCount={milestones.total}
                      pageRangeDisplayed={visiblePages}
                      onChange={handleMilestonePageChanged}
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

export default MilestonesSection;
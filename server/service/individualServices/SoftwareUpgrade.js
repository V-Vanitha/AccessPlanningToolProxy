const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const eventDispatcher = require('onf-core-model-ap/applicationPattern/rest/client/eventDispatcher');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} forwardingKindName forwarding Name
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
exports.forwardRequest = async function (forwardingKindName, attributeList, user, xCorrelator, traceIndicator, customerJourney) {
    let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingKindName);
    let operationClientUuid = (getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance))[0];
    let result = await eventDispatcher.dispatchEvent(
      operationClientUuid,
      attributeList,
      user,
      xCorrelator,
      traceIndicator,
      customerJourney
    );
    return result; 
  }
  
  function getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance) {
  let fcPortOutputLogicalTerminationPointList = [];
  let fcPortList = forwardingConstructInstance[
  onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
  for (let i = 0; i < fcPortList.length; i++) {
  let fcPort = fcPortList[i];
  let fcPortPortDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
  if (fcPortPortDirection == FcPort.portDirectionEnum.OUTPUT) {
    let fclogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
    fcPortOutputLogicalTerminationPointList.push(fclogicalTerminationPoint);
  }
  }
  return fcPortOutputLogicalTerminationPointList;
  }
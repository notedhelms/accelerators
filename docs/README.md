# Corticon Decision Magement

For business processes that involve complex decision transactions such as credit approvals, financial modeling, machinery inspections, or insurance claims processing, the rules governing these decisions are extensive, prone to change, and high-impact--and that's before even attempting to automate any aspect of them. Given the requisite expertise for the personnel with the knowledge about these policies, it's a tall order to then translate requirements into application code. 

So instead of that, Progress Corticon enables the users most familiar with complex policy rules, whatever the domain or industry, to author and test that application logic without coding. 

<p align="center">  <img src="assets/be-more-explicit.jpg" width="400"/></p>

Progress Corticon is a no code business rules management solution that enables organizations to rapidly execute such changes to keep apps fresh and compliant. With a spreadsheet-like interface, it is an easy-to-use solution that enab​​les business users to execute rules changes with little reliance on IT resources.


## Components of Corticon

Corticon is broken out into **rule definition** and **rule execution** components.

1.  Rules are designed, logically analyzed, documented, sequenced, and tested in **[Corticon Studio](studio/)**, along with any configurations for accessing/operating upon external datasources.

Rules are then either:

2) **[Corticon Server Deployment](server/)**: Deployed as stateless decision services on a Corticon Server, exposed as web services or embedded within a Java application.
3) **[Corticon.js Deployment](js/)**: Transpiled into a self-contained JavaScript bundle, runnable wherever JavaScript is supported.

<br>
<br>
<p align="center">  <img src="assets/design flow corticon.png" width="800"/>
</p>

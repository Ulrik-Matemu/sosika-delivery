/* empty css              */(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",function(){document.querySelector("form").addEventListener("submit",function(o){o.preventDefault();const n={fullName:document.getElementById("name").value,password:document.getElementById("password").value};fetch("http://localhost:3001/api/deliveryPerson/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then(r=>r.json()).then(r=>{r.message==="Delivery person login successful"?(alert("Login successful!"),localStorage.setItem("deliveryPersonName",r.deliveryPersonName),localStorage.setItem("deliveryPersonId",r.deliveryPersonId),window.location.href="home.html"):alert("Login failed: "+r.message)}).catch(r=>{console.error("Error:",r),alert("An error occurred during login.")})})});

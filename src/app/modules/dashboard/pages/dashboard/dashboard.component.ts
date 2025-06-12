import { Component } from '@angular/core';
import { ImportsModule } from '../../../../imports';

@Component({
  selector: 'app-dashboard',
  imports: [ImportsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // Sample analytics data
  totalComputers = 320;
  totalCampuses = 4;
  computersByCampus = [
    { campus: 'Main', count: 120 },
    { campus: 'North', count: 80 },
    { campus: 'South', count: 60 },
    { campus: 'East', count: 60 },
  ];
  totalRequests = 45;
  pendingRepairs = 12;
  completedRepairs = 28;
  inUse = 210;
  available = 90;
  defective = 20;

  // Additional analytics data
  totalLabs = 12;
  totalLabManagers = 6;
  totalSoftware = 48;
  totalHardwareIssues = 15;
  totalSoftwareIssues = 8;
  computersUtilization = 0.82; // 82% utilization

  // Chart data for PrimeNG
  computersPie = {
    labels: ['In Use', 'Available', 'Defective'],
    datasets: [
      {
        data: [210, 90, 20],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
        hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D'],
      },
    ],
  };

  requestsBar = {
    labels: ['Pending', 'Completed'],
    datasets: [
      {
        label: 'Repair Requests',
        backgroundColor: ['#FFA726', '#66BB6A'],
        data: [12, 28],
      },
    ],
  };

  campusComputers = {
    labels: this.computersByCampus.map((c) => c.campus),
    datasets: [
      {
        label: 'Computers by Campus',
        backgroundColor: '#42A5F5',
        data: this.computersByCampus.map((c) => c.count),
      },
    ],
  };

  // Minimal chart for utilization
  utilizationDoughnut = {
    labels: ['Utilized', 'Free'],
    datasets: [
      {
        data: [82, 18],
        backgroundColor: ['#42A5F5', '#E0E0E0'],
        hoverBackgroundColor: ['#64B5F6', '#F5F5F5'],
      },
    ],
  };

  // Minimal bar for issues
  issuesBar = {
    labels: ['Hardware', 'Software'],
    datasets: [
      {
        label: 'Issues',
        backgroundColor: ['#EF5350', '#FFA726'],
        data: [15, 8],
      },
    ],
  };
}

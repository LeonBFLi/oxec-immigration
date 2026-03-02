import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { trpc } from '@/lib/trpc';

/**
 * Password strength indicator
 */
function PasswordStrengthIndicator({ password }: { password: string }) {
  const requirements = [
    { label: '至少8个字符', met: password.length >= 8 },
    { label: '包含大写字母', met: /[A-Z]/.test(password) },
    { label: '包含小写字母', met: /[a-z]/.test(password) },
    { label: '包含数字', met: /[0-9]/.test(password) },
    { label: '包含特殊字符', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const metCount = requirements.filter(r => r.met).length;
  const strength = metCount === 5 ? 'strong' : metCount >= 3 ? 'medium' : 'weak';
  const strengthColor = strength === 'strong' ? 'text-green-600' : strength === 'medium' ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-2 mt-2">
      <div className={`text-sm font-medium ${strengthColor}`}>
        密码强度: {strength === 'strong' ? '强' : strength === 'medium' ? '中等' : '弱'}
      </div>
      <div className="space-y-1">
        {requirements.map((req) => (
          <div key={req.label} className="flex items-center gap-2 text-sm">
            {req.met ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <div className="w-4 h-4 border border-gray-300 rounded-full" />
            )}
            <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.adminAuth.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        username,
        password,
      });

      if (result.success) {
        if (result.mfaRequired) {
          // Store admin ID for MFA verification
          sessionStorage.setItem('adminId', result.adminId?.toString() || '');
          sessionStorage.setItem('mfaMethod', result.mfaMethod || '');
          setLocation('/admin/mfa-verify');
        } else if (result.token && result.expiresAt) {
          // Store token and redirect to admin dashboard
          localStorage.setItem('adminToken', result.token);
          localStorage.setItem('adminExpiresAt', new Date(result.expiresAt).getTime().toString());
          setLocation('/admin/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">OXEC 管理后台</CardTitle>
          <CardDescription className="text-center">
            请输入您的用户名和密码登录
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                用户名
              </label>
              <Input
                id="username"
                type="text"
                placeholder="输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {password && <PasswordStrengthIndicator password={password} />}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
              <p className="font-semibold mb-2">密码要求:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>至少8个字符</li>
                <li>包含大写字母 (A-Z)</li>
                <li>包含小写字母 (a-z)</li>
                <li>包含数字 (0-9)</li>
                <li>包含特殊字符 (!@#$%^&*等)</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
